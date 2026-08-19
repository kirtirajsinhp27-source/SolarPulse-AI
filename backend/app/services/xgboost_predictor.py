import pandas as pd
import numpy as np
from pathlib import Path
import joblib

MODEL_PATH = Path("app/ml_models/solar_xgboost.pkl")
model = joblib.load(MODEL_PATH)

# Values learned from the original validation run - do not change without re-validating
ANOMALY_THRESHOLD = 1108.6  # kWh, from validation residual std
TARIFF_PER_KWH = 5.0        # placeholder - replace with real tariff
DATASET_START = pd.Timestamp("2012-01-01")  # matches training data start


def predict_generation(date_str: str, insolation: float, actual_generation: float = None):
    """
    date_str: 'YYYY-MM-DD'
    insolation: float, e.g. 5.2
    actual_generation: optional, if you want deviation/anomaly info too
    """
    date = pd.Timestamp(date_str)
    day_of_year = date.dayofyear

    features = pd.DataFrame([{
        "Insolation": insolation,
        "month": date.month,
        "day_of_week": date.dayofweek,
        "day_of_year_sin": np.sin(2 * np.pi * day_of_year / 365),
        "day_of_year_cos": np.cos(2 * np.pi * day_of_year / 365),
        "days_since_start": (date - DATASET_START).days,
        "insolation_sq": insolation ** 2,
        "insolation_x_month": insolation * date.month
    }])

    predicted = float(model.predict(features)[0])

    result = {
        "date": date_str,
        "predicted_generation": round(predicted, 2)
    }

    if actual_generation is not None:
        residual = actual_generation - predicted
        deviation_percent = (residual / predicted * 100) if predicted != 0 else 0
        is_anomaly = abs(residual) > ANOMALY_THRESHOLD
        energy_loss = max(0, -residual) if is_anomaly else 0

        result.update({
            "actual_generation": actual_generation,
            "deviation_percent": round(deviation_percent, 2),
            "anomaly": bool(is_anomaly),
            "estimated_loss_kwh": round(energy_loss, 2),
            "estimated_loss_money": round(energy_loss * TARIFF_PER_KWH, 2),
            "fault": "possible grid/inverter issue" if is_anomaly and residual < 0 else None
        })

    return result
