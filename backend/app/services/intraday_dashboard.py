import pandas as pd
from pathlib import Path

from app.services.diagnosis import diagnose_real_day


INTRADAY_PATH = Path("data/processed/intraday_loss_simulated.csv")
DAILY_PREDICTIONS_PATH = Path("data/processed/test_predictions.csv")
DAILY_DATA_PATH = Path("data/processed/test.csv")

OUTPUT_PATH = Path("data/processed/dashboard_intraday.csv")

TARIFF_PER_KWH = 5.0


def build_dashboard_intraday(date):
    """
    Builds dashboard-ready intraday data for one day.

    Existing XGBoost model and prediction pipeline are untouched.
    """

    # Load intraday expected/actual data
    intraday = pd.read_csv(INTRADAY_PATH)

    intraday["Date"] = pd.to_datetime(
        intraday["Date"]
    ).dt.strftime("%Y-%m-%d")

    date = pd.to_datetime(date).strftime("%Y-%m-%d")

    day = intraday[intraday["Date"] == date].copy()

    if day.empty:
        raise ValueError(
            f"No intraday data found for {date}"
        )

    # Load daily prediction + real plant data
    predictions = pd.read_csv(DAILY_PREDICTIONS_PATH)
    plant = pd.read_csv(DAILY_DATA_PATH)

    daily_prediction = predictions[
        predictions["Date"] == date
    ]

    daily_plant = plant[
        plant["Date"] == date
    ]

    if daily_prediction.empty:
        raise ValueError(
            f"No XGBoost prediction found for {date}"
        )

    if daily_plant.empty:
        raise ValueError(
            f"No plant data found for {date}"
        )

    prediction_row = daily_prediction.iloc[0]
    plant_row = daily_plant.iloc[0]

    # --------------------------------------------------
    # DAILY DIAGNOSIS
    # --------------------------------------------------

    diagnosis = diagnose_real_day(
        row=plant_row,
        anomaly=bool(prediction_row["anomaly_flag"]),
        residual_kwh=float(prediction_row["residual_kwh"]),
    )

    # --------------------------------------------------
    # INTRADAY CALCULATIONS
    # --------------------------------------------------

    day["expected_generation_kwh"] = (
        day["expected_hourly_kwh"]
    )

    day["actual_generation_kwh"] = (
        day["actual_hourly_kwh"]
    )

    day["lost_energy_kwh"] = (
        day["expected_generation_kwh"]
        - day["actual_generation_kwh"]
    )

    # Only positive loss counts as energy loss
    day["loss_kwh"] = day["lost_energy_kwh"].clip(
        lower=0
    )

    day["loss_percent"] = 0.0

    valid_expected = (
        day["expected_generation_kwh"] > 0
    )

    day.loc[valid_expected, "loss_percent"] = (
        day.loc[valid_expected, "loss_kwh"]
        / day.loc[
            valid_expected,
            "expected_generation_kwh"
        ]
        * 100
    )

    day["financial_loss_inr"] = (
        day["loss_kwh"] * TARIFF_PER_KWH
    )

    # --------------------------------------------------
    # CUMULATIVE VALUES
    # --------------------------------------------------

    day = day.sort_values("hour").reset_index(
        drop=True
    )

    day["cumulative_loss_kwh"] = (
        day["loss_kwh"].cumsum()
    )

    day["cumulative_financial_loss_inr"] = (
        day["financial_loss_inr"].cumsum()
    )

    # --------------------------------------------------
    # DAILY DIAGNOSIS FOR EVERY POINT
    # --------------------------------------------------

    day["reason"] = diagnosis["reason"]
    day["confidence"] = diagnosis["confidence"]

    day["historical_simulation"] = True
    day["simulated_live"] = True

    # --------------------------------------------------
    # CLEAN DASHBOARD OUTPUT
    # --------------------------------------------------

    output_columns = [
        "Date",
        "hour",
        "irradiance_whm2",
        "expected_generation_kwh",
        "actual_generation_kwh",
        "loss_kwh",
        "loss_percent",
        "cumulative_loss_kwh",
        "financial_loss_inr",
        "cumulative_financial_loss_inr",
        "reason",
        "confidence",
        "historical_simulation",
        "simulated_live",
    ]

    result = day[output_columns].copy()

    return result


def save_dashboard_intraday(date):
    result = build_dashboard_intraday(date)

    result.to_csv(
        OUTPUT_PATH,
        index=False
    )

    print("\n========== DASHBOARD INTRADAY ==========")
    print("Date:", date)
    print("Rows:", len(result))
    print("Saved:", OUTPUT_PATH)

    print("\nData:")
    print(
        result.to_string(index=False)
    )

    print(
        "\nTotal daily loss:",
        round(
            result["loss_kwh"].sum(),
            2
        ),
        "kWh"
    )

    print(
        "Total financial loss: ₹",
        round(
            result["financial_loss_inr"].sum(),
            2
        )
    )

    print(
        "Diagnosis:",
        result["reason"].iloc[0]
    )

    print(
        "Confidence:",
        result["confidence"].iloc[0]
    )


if __name__ == "__main__":
    save_dashboard_intraday("2022-07-01")