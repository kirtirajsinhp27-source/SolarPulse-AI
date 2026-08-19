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

class DailyPredictionInput(BaseModel):
    date: str = Field(..., example="2022-07-01")
    insolation: float = Field(..., example=5.5)
    actual_generation: float | None = Field(default=None, example=4200.0)


class DailyPredictionResponse(BaseModel):
    date: str
    predicted_generation: float
    actual_generation: float | None = None
    deviation_percent: float | None = None
    anomaly: bool | None = None
    estimated_loss_kwh: float | None = None
    estimated_loss_money: float | None = None
    fault: str | None = None


class IntradayAnalyzeInput(BaseModel):
    date: str = Field(..., example="2022-07-01")
    hour: int = Field(..., example=13)
    actual_generation_kwh: float | None = Field(default=None, example=96.2)
    irradiance_wm2: float | None = Field(default=None, example=850.0)
    expected_generation_kwh: float | None = Field(default=None, example=120.5)
