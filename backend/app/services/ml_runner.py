class MLRunner:

    @staticmethod
    def analyze_string_telemetry(voltage: float, current: float, irradiance: float, temp: float):
        # Calculated power output in Watts
        actual_power = voltage * current

        # Theoretical max power output (e.g., 10 panels of 350W = 3500W total string rating)
        expected_power = (irradiance / 1000.0) * 3500.0

        # Calculate efficiency loss percentage
        if expected_power > 0:
            loss_percent = max(0.0, min(100.0, ((expected_power - actual_power) / expected_power) * 100.0))
        else:
            loss_percent = 0.0

        # Fault classification logic
        fault_type = "Normal Operation"
        if loss_percent > 40.0:
            fault_type = "Severe Shading / Bypass Diode Failure"

        return {
            "actual_power_w": round(actual_power, 2),
            "expected_power_w": round(expected_power, 2),
            "efficiency_loss_percent": round(loss_percent, 2),
            "fault_type": fault_type
        }