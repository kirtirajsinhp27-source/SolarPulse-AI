import traceback
from datetime import datetime, timezone, timedelta
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.solar import DiagnosticReport
from app.services.ml_runner import MLRunner
from app.schemas import TelemetryInput
from app.crud.crud_telemetry import get_telemetry_history
from app.services.excel_telemetry import read_excel_telemetry
from app.config import settings

router = APIRouter(
    tags=["Diagnostics"]
)

@router.post("/analyze")
async def analyze_telemetry(data: TelemetryInput, db: AsyncSession = Depends(get_db)):
    # 1. Calculation phase
    try:
        temp_val = getattr(data, 'temperature', getattr(data, 'temp', 25.0))
        result = MLRunner.analyze_string_telemetry(
            voltage=data.voltage,
            current=data.current,
            irradiance=data.irradiance,
            temp=temp_val
        )
    except Exception as calc_err:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"MLRunner Error: {str(calc_err)}")

    # 2. Database save phase
    try:
        report = DiagnosticReport(
            string_id=data.string_id,
            fault_type=result.get("fault_type", "Normal Operation"),
            efficiency_loss=result.get("efficiency_loss_percent", 0.0),
            power_output_kw=result.get("actual_power_w", 0.0) / 1000.0,
            heatmap_matrix=None,
            timestamp=datetime.now(timezone.utc)  # Explicit UTC timestamp
        )
        db.add(report)
        await db.commit()
        await db.refresh(report)
    except Exception as db_err:
        await db.rollback()
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Database Save Error: {str(db_err)}")

    return result

@router.post("/ai/analyze-panel")
async def analyze_panel(data: TelemetryInput):
    return MLRunner.analyze_panel_telemetry(
        panel_id=data.panel_id or "UNKNOWN_PANEL",
        voltage=data.voltage,
        current=data.current,
        irradiance=data.irradiance,
        temp=data.temperature,
    )

@router.get("/reports", response_model=List[dict])
async def get_diagnostic_reports(limit: int = 10, db: AsyncSession = Depends(get_db)):
    try:
        result = await db.execute(
            select(DiagnosticReport).order_by(DiagnosticReport.timestamp.desc()).limit(limit)
        )
        reports = result.scalars().all()
        return [
            {
                "id": str(r.id),
                "string_id": r.string_id,
                "fault_type": r.fault_type,
                "efficiency_loss": r.efficiency_loss,
                "power_output_kw": r.power_output_kw,
                "timestamp": r.timestamp.isoformat() if r.timestamp else None
            }
            for r in reports
        ]
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to fetch reports: {str(e)}")

@router.get("/telemetry/history")
async def telemetry_history(
    timeframe: str = "Today",
    string_id: str = "ALL",
    limit: int = 500,
    db: AsyncSession = Depends(get_db),
):
    durations = {
        "Today": timedelta(days=1),
        "7 Days": timedelta(days=7),
        "30 Days": timedelta(days=30),
        "Year": timedelta(days=365),
    }
    since = datetime.now(timezone.utc) - durations.get(timeframe, durations["Today"])
    try:
        records = await get_telemetry_history(db, string_id, since, min(max(limit, 1), 5000))
    except Exception:
        records = []
    if not records:
        excel_records = read_excel_telemetry(settings.EXCEL_DATA_PATH)
        if excel_records:
            anchor = datetime.fromisoformat(excel_records[-1]["timestamp"]).replace(tzinfo=timezone.utc)
            since = anchor - durations.get(timeframe, durations["Today"])
        records = [record for record in excel_records if datetime.fromisoformat(record["timestamp"]).replace(tzinfo=timezone.utc) >= since]
        return records[-min(max(limit, 1), 5000):]
    return [
        {
            "id": str(record.id),
            "string_id": record.string_id,
            "panel_id": record.panel_id,
            "voltage": record.voltage,
            "current": record.current,
            "temperature": record.temperature,
            "irradiance": record.irradiance,
            "timestamp": record.timestamp.isoformat() if record.timestamp else None,
        }
        for record in records
    ]

@router.get("/ai/insights")
async def historical_ai_insights(
    timeframe: str = "Today",
    db: AsyncSession = Depends(get_db),
):
    durations = {
        "Today": timedelta(days=1),
        "7 Days": timedelta(days=7),
        "30 Days": timedelta(days=30),
        "Year": timedelta(days=365),
    }
    excel_records = read_excel_telemetry(settings.EXCEL_DATA_PATH)
    if not excel_records:
        return []
    anchor = datetime.fromisoformat(excel_records[-1]["timestamp"]).replace(tzinfo=timezone.utc)
    since = anchor - durations.get(timeframe, durations["Today"])
    records = [record for record in excel_records if datetime.fromisoformat(record["timestamp"]).replace(tzinfo=timezone.utc) >= since]
    analyzed = [MLRunner.analyze_historical_record(record) | {"timestamp": record["timestamp"]} for record in records]
    if not analyzed:
        return []
    worst = sorted(analyzed, key=lambda item: item["efficiency_loss_percent"], reverse=True)[:3]
    return [
        {
            "id": f"ai-{item['timestamp']}",
            "title": item["fault_type"],
            "category": "maintenance" if item["efficiency_loss_percent"] >= 15 else "efficiency",
            "impact": f"{item['efficiency_loss_percent']:.1f}% estimated loss",
            "confidencePercent": item["confidence_percent"],
            "actionLabel": item["action_label"],
            "description": item["solution"],
            "timestamp": item["timestamp"],
            "priority": "high" if item["efficiency_loss_percent"] >= 30 else "medium",
        }
        for item in worst
    ]