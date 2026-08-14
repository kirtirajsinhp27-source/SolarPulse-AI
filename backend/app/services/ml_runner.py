import numpy as np
from typing import Dict, Any, List

class FaultDiagnosticEngine:
    """
    Inference service for processing solar string telemetry and
    calculating power extraction, efficiency loss, and fault type.
    """
    
    @staticmethod
    def analyze_string_telemetry(voltage: float, current: float, irradiance: float, temp: float) -> Dict[str, Any]:
        # Calculated power output in Watts
        actual_power = voltage * current
        
        # Theoretical max power based on irradiance (1000 W/m² standard testing condition)
        expected_power = (irradiance / 1000.0) * 350.0  # Assuming 350W rated panel
        
        # Calculate efficiency loss ratio
        if expected_power > 0:
            loss_percent = max(0.0, min(100.0, ((expected_power - actual_power) / expected_power) * 100))
        else:
            loss_percent = 0.0

        # Basic fault diagnostic classifier logic
        fault_type = "Normal Operation"
        if loss_percent > 40.0:
            fault_type = "Severe Shading / Bypass Diode Failure"
        elif loss_percent > 15.0:
            fault_type = "Partial Shading / Soiling"
        elif temp > 65.0:
            fault_type = "Thermal Hotspot Detected"

        return {
            "actual_power_w": round(actual_power, 2),
            "expected_power_w": round(expected_power, 2),
            "efficiency_loss_percent": round(loss_percent, 2),
            "fault_type": fault_type
        }

    @staticmethod
    def generate_heatmap_matrix(rows: int = 4, cols: int = 4) -> List[List[float]]:
        """
        Generates a 2D matrix representing efficiency/power extraction 
        ratios across a solar array grid for frontend visualization.
        """
        # Generates matrix with values between 0.60 (60% efficiency) and 1.0 (100% efficiency)
        np.random.seed(42)
        grid = np.random.uniform(0.70, 0.99, size=(rows, cols))
        # Introduce a artificial hotspot / fault in the matrix
        grid[1][2] = 0.35 
        return grid.round(2).tolist()

diagnostic_engine = FaultDiagnosticEngine()