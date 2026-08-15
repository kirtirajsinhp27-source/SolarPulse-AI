from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.schemas.telemetry import TelemetryInput, DiagnosticResponse, HeatmapResponse
from app.services.ml_runner import diagnostic_engine
from app.crud.crud_telemetry import create_telemetry_log, create_diagnostic_report

router = APIRouter(prefix="/diagnostics", tags=["Diagnostics & ML"])

@router.post("/analyze", response_model=DiagnosticResponse, status_code=status.HTTP_201_CREATED)
async def analyze_and_store_telemetry(data: TelemetryInput, db: AsyncSession = Depends(get_db)):
    # 1. Save incoming telemetry to panel_telemetry table
    await create_telemetry_log(db, data)
    
    # 2. Process ML Diagnostics
    analysis = diagnostic_engine.analyze_string_telemetry(
        voltage=data.voltage,
        current=data.current,
        irradiance=data.irradiance,
        temp=data.temperature
    )
    
    response = DiagnosticResponse(
        string_id=data.string_id,
        actual_power_w=analysis["actual_power_w"],
        expected_power_w=analysis["expected_power_w"],
        efficiency_loss_percent=analysis["efficiency_loss_percent"],
        fault_type=analysis["fault_type"]
    )
    
    # 3. Save Diagnostic output to diagnostic_reports table
    await create_diagnostic_report(db, response)
    
    return response

@router.get("/heatmap/{string_id}", response_model=HeatmapResponse)
async def get_string_heatmap(string_id: str, rows: int = 4, cols: int = 4):
    matrix = diagnostic_engine.generate_heatmap_matrix(rows=rows, cols=cols)
    return HeatmapResponse(
        string_id=string_id,
        rows=rows,
        cols=cols,
        matrix=matrix
    )