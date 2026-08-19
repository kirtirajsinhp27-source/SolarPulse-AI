import traceback

from fastapi import APIRouter, HTTPException

from app.services.xgboost_predictor import predict_generation
from app.schemas import DailyPredictionInput, DailyPredictionResponse

router = APIRouter(
    tags=["Predictions"]
)


@router.post("/predict-daily", response_model=DailyPredictionResponse)
async def predict_daily(data: DailyPredictionInput):
    try:
        result = predict_generation(
            date_str=data.date,
            insolation=data.insolation,
            actual_generation=data.actual_generation
        )
    except Exception as err:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Prediction Error: {str(err)}")

    return result
