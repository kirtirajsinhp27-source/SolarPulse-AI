import traceback
from datetime import datetime, timezone
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.solar import DiagnosticReport
from app.services.ml_runner import MLRunner
from app.schemas import TelemetryInput

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