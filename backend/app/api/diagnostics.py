from fastapi import APIRouter
from app.schemas import TelemetryInput, DiagnosticResponse, HeatmapResponse
from app.services.ml_runner import diagnostic_engine

router = APIRouter(prefix="/diagnostics", tags=["Diagnostics & ML"])

@router.post("/analyze", response_model=DiagnosticResponse)
async def analyze_telemetry(data: TelemetryInput):
    analysis = diagnostic_engine.analyze_string_telemetry(
        voltage=data.voltage,
        current=data.current,
        irradiance=data.irradiance,
        temp=data.temperature
    )
    return DiagnosticResponse(
        string_id=data.string_id,
        actual_power_w=analysis["actual_power_w"],
        expected_power_w=analysis["expected_power_w"],
        efficiency_loss_percent=analysis["efficiency_loss_percent"],
        fault_type=analysis["fault_type"]
    )

@router.get("/heatmap/{string_id}", response_model=HeatmapResponse)
async def get_string_heatmap(string_id: str, rows: int = 4, cols: int = 4):
    matrix = diagnostic_engine.generate_heatmap_matrix(rows=rows, cols=cols)
    return HeatmapResponse(
        string_id=string_id,
        rows=rows,
        cols=cols,
        matrix=matrix
    )