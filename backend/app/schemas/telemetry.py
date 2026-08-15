from pydantic import BaseModel, Field
from typing import List, Optional

class TelemetryInput(BaseModel):
    string_id: str = Field(..., example="STRING_A")
    panel_id: Optional[str] = Field(default="PANEL_01", example="PANEL_01")
    voltage: float = Field(..., example=380.5)
    current: float = Field(..., example=8.2)
    irradiance: float = Field(..., example=950.0)
    temperature: float = Field(..., example=45.0)

class DiagnosticResponse(BaseModel):
    string_id: str
    actual_power_w: float
    expected_power_w: float
    efficiency_loss_percent: float
    fault_type: str

class HeatmapResponse(BaseModel):
    string_id: str
    rows: int
    cols: int
    matrix: List[List[float]]