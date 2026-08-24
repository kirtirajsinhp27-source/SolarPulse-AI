import pandas as pd
from pathlib import Path
from fastapi import APIRouter, HTTPException

router = APIRouter(
    prefix="/historical",
    tags=["Historical Analytics"],
)

BASE_DIR = Path(__file__).resolve().parents[2]
TEST_PATH = BASE_DIR / "data" / "processed" / "test.csv"
PREDICTIONS_PATH = BASE_DIR / "data" / "processed" / "test_predictions.csv"


@router.get("/{timeframe}")
async def get_historical_analytics(timeframe: str):
    """
    Return historical generation, XGBoost prediction,
    anomaly and loss data for the requested timeframe.
    """

    timeframe = timeframe.lower()

    if timeframe not in {"7days", "30days", "year"}:
        raise HTTPException(
            status_code=400,
            detail="Timeframe must be 7days, 30days, or year",
        )

    try:
        plant = pd.read_csv(TEST_PATH)
        predictions = pd.read_csv(PREDICTIONS_PATH)

        plant["Date"] = pd.to_datetime(plant["Date"])
        predictions["Date"] = pd.to_datetime(predictions["Date"])

        df = plant.merge(
            predictions,
            on="Date",
            how="inner",
            suffixes=("", "_prediction"),
        )

        df = df.sort_values("Date")

        if df.empty:
            raise HTTPException(
                status_code=404,
                detail="No historical data available",
            )

        latest_date = df["Date"].max()

        if timeframe == "7days":
            start_date = latest_date - pd.Timedelta(days=6)

        elif timeframe == "30days":
            start_date = latest_date - pd.Timedelta(days=29)

        else:
            start_date = latest_date - pd.Timedelta(days=364)

        filtered = df[df["Date"] >= start_date].copy()

        result = []

        for _, row in filtered.iterrows():
            result.append(
                {
                    "date": row["Date"].strftime("%Y-%m-%d"),
                    "actual_generation_kwh": round(
                        float(row["actual_generation_kwh"]), 2
                    ),
                    "predicted_generation_kwh": round(
                        float(row["predicted_generation_kwh"]), 2
                    ),
                    "residual_kwh": round(
                        float(row["residual_kwh"]), 2
                    ),
                    "anomaly_flag": bool(row["anomaly_flag"]),
                    "fault_diagnosis": str(row["fault_diagnosis"]),
                    "estimated_lost_energy_kwh": round(
                        float(row["estimated_lost_energy_kwh"]), 2
                    ),
                    "estimated_financial_loss_inr": round(
                        float(row["estimated_financial_loss_inr"]), 2
                    ),
                    "insolation": round(
                        float(row["Insolation"]), 3
                    ),
                }
            )

        return {
            "timeframe": timeframe,
            "start_date": filtered["Date"].min().strftime("%Y-%m-%d"),
            "end_date": filtered["Date"].max().strftime("%Y-%m-%d"),
            "records": result,
        }

    except HTTPException:
        raise

    except Exception as err:
        raise HTTPException(
            status_code=500,
            detail=f"Historical analytics error: {str(err)}",
        )