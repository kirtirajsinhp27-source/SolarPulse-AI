import traceback

from fastapi import APIRouter, HTTPException

from app.services.intraday_loss import analyze_power_point
from app.services.intraday_dashboard import build_dashboard_intraday
from app.schemas import IntradayAnalyzeInput

router = APIRouter(
    tags=["Intraday"]
)


@router.post("/intraday/analyze")
async def intraday_analyze(data: IntradayAnalyzeInput):
    try:
        result = analyze_power_point(
            date=data.date,
            hour=data.hour,
            actual_generation_kwh=data.actual_generation_kwh,
            irradiance_wm2=data.irradiance_wm2,
            expected_generation_kwh=data.expected_generation_kwh,
        )
    except ValueError as val_err:
        raise HTTPException(status_code=404, detail=str(val_err))
    except Exception as err:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Intraday Analyze Error: {str(err)}")

    return result


@router.get("/intraday/dashboard/{date}")
async def intraday_dashboard(date: str):
    try:
        result = build_dashboard_intraday(date)
    except ValueError as val_err:
        raise HTTPException(status_code=404, detail=str(val_err))
    except Exception as err:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Intraday Dashboard Error: {str(err)}")

    return result.to_dict(orient="records")
