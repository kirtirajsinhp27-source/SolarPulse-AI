from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Dict, Any
from app.models.telemetry import PanelTelemetry, DiagnosticReport
from app.schemas.telemetry import TelemetryInput, DiagnosticResponse

async def create_telemetry_log(db: AsyncSession, data: TelemetryInput) -> PanelTelemetry:
    log = PanelTelemetry(
        string_id=data.string_id,
        panel_id=getattr(data, "panel_id", "PANEL_01"),  # defaults to PANEL_01 if panel_id isn't provided
        voltage=data.voltage,
        current=data.current,
        temperature=data.temperature,
        irradiance=data.irradiance
    )
    db.add(log)
    await db.flush()
    return log

async def create_diagnostic_report(
    db: AsyncSession, 
    diag: DiagnosticResponse, 
    heatmap_matrix: Dict[str, Any] = None
) -> DiagnosticReport:
    power_kw = (diag.actual_power_w) / 1000.0  # Convert Watts to kW to match your schema
    
    report = DiagnosticReport(
        string_id=diag.string_id,
        fault_type=diag.fault_type,
        efficiency_loss=diag.efficiency_loss_percent,
        power_output_kw=power_kw,
        heatmap_matrix=heatmap_matrix
    )
    db.add(report)
    await db.flush()
    return report

async def get_recent_telemetry(db: AsyncSession, string_id: str, limit: int = 100) -> List[PanelTelemetry]:
    stmt = (
        select(PanelTelemetry)
        .where(PanelTelemetry.string_id == string_id)
        .order_by(PanelTelemetry.timestamp.desc())
        .limit(limit)
    )
    result = await db.execute(stmt)
    return list(result.scalars().all())

async def get_telemetry_history(
    db: AsyncSession,
    string_id: str | None = None,
    since=None,
    limit: int = 500,
) -> List[PanelTelemetry]:
    stmt = select(PanelTelemetry)
    if string_id and string_id.upper() != "ALL":
        stmt = stmt.where(PanelTelemetry.string_id == string_id)
    if since is not None:
        stmt = stmt.where(PanelTelemetry.timestamp >= since)
    stmt = stmt.order_by(PanelTelemetry.timestamp.asc()).limit(limit)
    result = await db.execute(stmt)
    return list(result.scalars().all())