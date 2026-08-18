class MLRunner:

    @staticmethod
    def analyze_panel_telemetry(panel_id: str, voltage: float, current: float, irradiance: float, temp: float):
        result = MLRunner.analyze_string_telemetry(voltage, current, irradiance, temp)
        loss = result["efficiency_loss_percent"]
        temperature_alert = temp >= 55
        if temperature_alert:
            priority, repair_window, repair_cost_inr = "Critical", "Within 24 hours", 3500
            root_cause = "Thermal hotspot or excessive cell temperature"
            solution = "Inspect with a thermal camera, clean the panel, test the bypass diode, and replace the module if heating remains."
        elif loss >= 30:
            priority, repair_window, repair_cost_inr = "High", "Within 24 hours", 2500
            root_cause = "Severe output loss compared with irradiance-adjusted baseline"
            solution = "Inspect shading, soiling, loose connectors, bypass diodes, and the connected inverter string."
        elif loss >= 15:
            priority, repair_window, repair_cost_inr = "Medium", "Within 7 days", 1500
            root_cause = "Reduced output, likely soiling, mismatch, or cable resistance"
            solution = "Schedule cleaning and inspect string current matching, connectors, DC cables, and inverter ventilation."
        else:
            priority, repair_window, repair_cost_inr = "Low", "Next scheduled inspection", 0
            root_cause = "No abnormality detected"
            solution = "Continue monitoring; no immediate repair is required."
        return {
            **result,
            "panel_id": panel_id,
            "temperature_c": temp,
            "temperature_alert": temperature_alert,
            "root_cause": root_cause,
            "solution": solution,
            "repair_priority": priority,
            "repair_window": repair_window,
            "estimated_repair_cost_inr": repair_cost_inr,
            "confidence_percent": 94 if temperature_alert or loss >= 30 else 87,
        }

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
        elif temp >= 55.0:
            fault_type = "Thermal Hotspot Risk"

        temperature_alert = temp >= 55.0
        if temperature_alert:
            reason = "Module temperature is above 55°C and may be causing thermal derating or hotspot damage."
            solution = "Inspect with a thermal camera, clean the module, verify bypass diode continuity, and replace the module if the hotspot remains."
            repair_window = "Within 24 hours"
            repair_cost_inr = 3500
        elif loss_percent > 40.0:
            reason = "Measured output is substantially below irradiance-adjusted expected output."
            solution = "Inspect shading, soiling, loose connectors, bypass diodes, and the associated inverter string."
            repair_window = "Within 24 hours"
            repair_cost_inr = 2500
        elif loss_percent > 15.0:
            reason = "Output is below the normal operating baseline."
            solution = "Schedule cleaning and inspect string current matching, cable resistance, and inverter ventilation."
            repair_window = "Within 7 days"
            repair_cost_inr = 1500
        else:
            reason = "Telemetry is within the expected operating range."
            solution = "No immediate repair required; continue monitoring and include it in preventive maintenance."
            repair_window = "Next scheduled inspection"
            repair_cost_inr = 0

        return {
            "actual_power_w": round(actual_power, 2),
            "expected_power_w": round(expected_power, 2),
            "efficiency_loss_percent": round(loss_percent, 2),
            "fault_type": fault_type,
            "temperature_alert": temperature_alert,
            "reason": reason,
            "solution": solution,
            "repair_window": repair_window,
            "estimated_repair_cost_inr": repair_cost_inr,
        }

    @staticmethod
    def analyze_historical_record(record: dict):
        """Classify an Excel historical record and return an operator solution."""
        performance_ratio = record.get("performance_ratio")
        irradiance = float(record.get("irradiance", 0) or 0)
        generation_kwh = float(record.get("generation_kwh", 0) or 0)
        if performance_ratio is None:
            performance_ratio = 0.0 if irradiance == 0 else 75.0

        loss_percent = max(0.0, min(100.0, 100.0 - float(performance_ratio) * 100.0 if performance_ratio <= 1 else 100.0 - float(performance_ratio)))
        if irradiance == 0:
            fault_type = "No Insolation / Plant Offline"
            solution = "Check grid availability, inverter wake-up status, and weather or sensor communication before dispatching a panel repair."
            action = "Check plant status"
        elif loss_percent >= 30:
            fault_type = "Severe Yield Loss"
            solution = "Inspect the affected strings for shading, soiling, loose connectors, bypass-diode faults, and inverter trips; clean or replace the affected module after thermal inspection."
            action = "Dispatch diagnostics"
        elif loss_percent >= 15:
            fault_type = "Moderate Performance Loss"
            solution = "Schedule module cleaning and inspect string current matching, inverter ventilation, and DC cable resistance."
            action = "Schedule maintenance"
        else:
            fault_type = "Normal Operation"
            solution = "No urgent repair required. Continue telemetry monitoring and include the record in the next preventive inspection."
            action = "Continue monitoring"

        return {
            "fault_type": fault_type,
            "efficiency_loss_percent": round(loss_percent, 2),
            "generation_kwh": round(generation_kwh, 2),
            "performance_ratio": round(float(performance_ratio), 2),
            "solution": solution,
            "action_label": action,
            "confidence_percent": 92 if fault_type != "Normal Operation" else 86,
        }