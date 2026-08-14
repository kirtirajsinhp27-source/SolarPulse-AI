from pydantic import BaseModel, Field
from typing import List
from datetime import datetime

class TelemetryInput(BaseModel):
    string_id: str = Field(..., example="STRING_A")
    voltage: float = Field(..., example=38.5)
    current: float = Field(..., example=8.2)
    irradiance: float = Field(..., example=950.0)
    temperature: float = Field(..., example=45.0)

class DiagnosticResponse(BaseModel):
    string_id: str
    actual_power_w: float
    expected_power_w: float
    efficiency_loss_percent: float
    fault_type: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class HeatmapResponse(BaseModel):
    string_id: str
    rows: int
    cols: int
    matrix: List[List[float]]