import pandas as pd


def diagnose_real_day(row, anomaly=True, residual_kwh=None):
    """
    Evidence-based diagnosis layer for Solar PV losses.

    IMPORTANT:
    - Does NOT modify or retrain the existing XGBoost model.
    - Uses operational plant flags to identify the probable reason.
    - Positive residual means actual generation exceeded expected generation.
    """

    # --------------------------------------------------
    # 1. OVERPERFORMANCE
    # --------------------------------------------------
    # Actual generation > predicted generation
    if residual_kwh is not None and residual_kwh > 0:
        return {
            "reason": "Overperformance",
            "confidence": 0.85,
            "evidence": (
                "Actual generation exceeded model expectation."
            )
        }

    # --------------------------------------------------
    # 2. NORMAL
    # --------------------------------------------------
    if not anomaly:
        return {
            "reason": "Normal",
            "confidence": 0.90,
            "evidence": (
                "No significant generation anomaly detected."
            )
        }

    # --------------------------------------------------
    # 3. GRID FAILURE
    # --------------------------------------------------
    if row.get("Grid Failure", 0) == 1:
        return {
            "reason": "Grid Failure",
            "confidence": 0.95,
            "evidence": (
                "Grid Failure is explicitly recorded "
                "in the plant data."
            )
        }

    # --------------------------------------------------
    # 4. TRANSFORMER / MAINTENANCE
    # --------------------------------------------------
    if row.get(
        "Transformer replacement and maintenance", 0
    ) == 1:
        return {
            "reason": "Transformer / Maintenance-related shutdown",
            "confidence": 0.90,
            "evidence": (
                "Transformer replacement or maintenance "
                "is recorded for this date."
            )
        }

    # --------------------------------------------------
    # 5. INVERTER FAULT
    # --------------------------------------------------
    if row.get("Inverter", 0) == 1:
        return {
            "reason": "Inverter Fault",
            "confidence": 0.95,
            "evidence": (
                "Inverter fault is explicitly recorded "
                "in the plant data."
            )
        }

    # --------------------------------------------------
    # 6. CABLE / FUSE MAINTENANCE
    # --------------------------------------------------
    if row.get("Cable and Fuse maintenance", 0) == 1:
        return {
            "reason": "Cable / Fuse Maintenance",
            "confidence": 0.90,
            "evidence": (
                "Cable or fuse maintenance is recorded "
                "for this date."
            )
        }

    # --------------------------------------------------
    # 7. CLOUDY WEATHER
    # --------------------------------------------------
    if row.get("Cloudy", 0) == 1:
        return {
            "reason": "Cloudy Weather",
            "confidence": 0.80,
            "evidence": (
                "Cloudy weather is recorded in the "
                "plant data."
            )
        }

    # --------------------------------------------------
    # 8. RAIN
    # --------------------------------------------------
    if row.get("Rainy day", 0) == 1:
        return {
            "reason": "Rain / Weather Conditions",
            "confidence": 0.80,
            "evidence": (
                "Rainy conditions are recorded in the "
                "plant data."
            )
        }

    # --------------------------------------------------
    # 9. UNKNOWN UNDERPERFORMANCE
    # --------------------------------------------------
    return {
        "reason": "Unidentified Underperformance",
        "confidence": 0.50,
        "evidence": (
            "Generation anomaly detected, but no corresponding "
            "operational fault flag was recorded."
        )
    }