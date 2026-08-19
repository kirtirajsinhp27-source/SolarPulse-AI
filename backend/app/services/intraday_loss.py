"""
Backend interface for the intraday loss + fault diagnosis layer.

Two usage modes:

1) HISTORICAL LOOKUP (demo / dashboard backfill):
     analyze_power_point(date="2022-07-01", hour=13)
   Pulls expected/actual/irradiance from data/processed/intraday_loss_simulated.csv
   (built in Step 10). historical_simulation=True is included in the result.

2) LIVE / DIRECT INPUT (future sensor feed):
     analyze_power_point(
         date="2026-08-10", hour=13,
         actual_generation_kwh=96.2,
         irradiance_wm2=850,
         expected_generation_kwh=120.5,
     )
   Skips the CSV lookup and uses the values you pass directly.
   historical_simulation=False in the result.

Reason diagnosis rules are the same ones validated in Step 3
(notebooks/diagnose_faults_rulebased.py, 28/28 correct on labeled data).

Does NOT modify solar_xgboost.pkl, predict.py, or any existing files.
"""

import pandas as pd
from pathlib import Path
from functools import lru_cache

TARIFF_PER_KWH = 5.0  # PLACEHOLDER - configurable, see section 11 of spec

INTRADAY_LOSS_PATH = Path("data/processed/intraday_loss_simulated.csv")

IRRADIANCE_IMPOSSIBLE = 1100
DAYLIGHT_THRESHOLD = 50
ZERO_POWER_RATIO = 0.05
SHADING_RATIO = 0.75


@lru_cache(maxsize=1)
def _load_intraday_loss():
    df = pd.read_csv(INTRADAY_LOSS_PATH)
    df["Date"] = pd.to_datetime(df["Date"]).dt.strftime("%Y-%m-%d")
    return df


def _lookup_historical(date, hour):
    df = _load_intraday_loss()
    row = df[(df["Date"] == date) & (df["hour"] == hour)]
    if len(row) == 0:
        return None
    row = row.iloc[0]
    return {
        "expected_generation_kwh": float(row["expected_hourly_kwh"]),
        "actual_generation_kwh": float(row["actual_hourly_kwh"]),
        "irradiance_wm2": float(row["irradiance_whm2"]),
    }


def diagnose(actual_kwh, expected_kwh, irradiance_wm2):
    """Returns (reason: str, confidence: float, anomaly: bool)"""
    if irradiance_wm2 > IRRADIANCE_IMPOSSIBLE:
        return "Sensor Reading Anomaly", 0.95, True

    if irradiance_wm2 <= DAYLIGHT_THRESHOLD:
        return "Normal", 0.9, False

    if expected_kwh <= 0:
        return "Normal", 0.5, False

    ratio = actual_kwh / expected_kwh

    if ratio < ZERO_POWER_RATIO:
        return "Inverter Fault / Shutdown", 0.9, True
    elif ratio < SHADING_RATIO:
        confidence = round(min(0.9, 0.5 + (SHADING_RATIO - ratio)), 2)
        return "Partial Shading / Panel Degradation", confidence, True
    else:
        return "Normal", 0.85, False


def analyze_power_point(
    date,
    hour,
    actual_generation_kwh=None,
    irradiance_wm2=None,
    expected_generation_kwh=None,
    tariff_per_kwh=TARIFF_PER_KWH,
):
    historical_simulation = False

    if actual_generation_kwh is None or irradiance_wm2 is None or expected_generation_kwh is None:
        looked_up = _lookup_historical(date, hour)
        if looked_up is None:
            raise ValueError(
                f"No data for date={date}, hour={hour}. "
                "Either provide actual_generation_kwh, irradiance_wm2, and "
                "expected_generation_kwh directly (live mode), or use a "
                "date/hour present in intraday_loss_simulated.csv (historical mode)."
            )
        actual_generation_kwh = looked_up["actual_generation_kwh"]
        irradiance_wm2 = looked_up["irradiance_wm2"]
        expected_generation_kwh = looked_up["expected_generation_kwh"]
        historical_simulation = True

    lost_energy_kwh = expected_generation_kwh - actual_generation_kwh
    loss_percent = (
        (lost_energy_kwh / expected_generation_kwh * 100.0)
        if expected_generation_kwh > 0
        else 0.0
    )

    reason, confidence, anomaly = diagnose(
        actual_generation_kwh, expected_generation_kwh, irradiance_wm2
    )

    financial_loss_inr = max(lost_energy_kwh, 0) * tariff_per_kwh

    return {
        "date": date,
        "hour": hour,
        "expected_generation_kwh": round(expected_generation_kwh, 3),
        "actual_generation_kwh": round(actual_generation_kwh, 3),
        "lost_energy_kwh": round(lost_energy_kwh, 3),
        "loss_percent": round(loss_percent, 2),
        "anomaly": anomaly,
        "reason": reason,
        "confidence": confidence,
        "financial_loss_inr": round(financial_loss_inr, 2),
        "historical_simulation": historical_simulation,
    }


if __name__ == "__main__":
    print("=== Historical lookup mode: 2022-07-01, hour 13 (known shutdown day) ===")
    result = analyze_power_point(date="2022-07-01", hour=13)
    for k, v in result.items():
        print(f"  {k}: {v}")

    print("\n=== Live mode: direct values, matches spec example ===")
    result2 = analyze_power_point(
        date="2026-08-10",
        hour=13,
        actual_generation_kwh=96.2,
        irradiance_wm2=850,
        expected_generation_kwh=120.5,
    )
    for k, v in result2.items():
        print(f"  {k}: {v}")