import math
import time
from datetime import datetime, timezone

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api import (
    diagnostics,
    websockets,
    predictions,
    intraday,
    inverters,
    inverter_telemetry,
    historical,
)
from app.services.intraday_dashboard import build_dashboard_intraday


def build_default_panels():
    arrays = ["Array A", "Array B", "Array C", "Array D"]
    panels = []

    for array_index, array_name in enumerate(arrays):
        for i in range(12):
            string_index = 1 if i < 6 else 2
            module_id = f"MOD-{chr(65 + array_index)}{str(i + 1).zfill(2)}"
            panel = {
                "id": module_id,
                "arrayId": array_name,
                "stringId": f"STR-{chr(65 + array_index)}{string_index}",
                "row": 1 if i < 6 else 2,
                "col": (i % 6) + 1,
                "status": "warning" if array_index == 1 and i == 5 else "optimal",
                "voltageV": round(41.4 + ((i % 4) * 0.7), 1),
                "currentA": round(9.2 + ((i % 5) * 0.4), 1),
                "powerW": round(390 + ((i % 6) * 14) + (array_index * 10), 1),
                "temperatureC": 56.4 if array_index == 1 and i == 5 else round(43.5 + (i % 4) * 0.9, 1),
                "efficiencyPercent": 81.2 if array_index == 1 and i == 5 else round(96.4 - (i % 4) * 0.3, 1),
                "mpptChannel": f"MPPT-{array_index + 1}{string_index}",
                "issueDescription": "Thermal hotspot detected." if array_index == 1 and i == 5 else None,
            }
            panels.append(panel)

    return panels


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "https://frontend-mu-opal-90.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    diagnostics.router,
    prefix=settings.API_V1_STR
)

app.include_router(
    predictions.router,
    prefix=settings.API_V1_STR
)

app.include_router(
    intraday.router,
    prefix=settings.API_V1_STR
)

app.include_router(
    websockets.router,
    prefix=settings.API_V1_STR
)

app.include_router(
    inverters.router,
    prefix=settings.API_V1_STR
)

app.include_router(
    inverter_telemetry.router,
    prefix=settings.API_V1_STR
)

app.include_router(
    historical.router,
    prefix=settings.API_V1_STR
)

@app.get(f"{settings.API_V1_STR}/dashboard/overview")
async def dashboard_overview():
    if settings.SHOWCASE_DATA:
        wave = math.sin(time.time() / 8)
        current_power = round(188.4 + (wave * 4.5), 2)
        irradiance = round(842 + (wave * 18))

        return {
            "metrics": {
                "currentPowerKW": current_power,
                "ratedCapacityKW": 250.0,
                "dailyGenerationKWh": 1432.8,
                "dailyTargetKWh": 1650.0,
                "electricityLossKWh": 217.2,
                "financialLossINR": 1086.0,
                "lossReason": "MPPT underperformance / thermal derating",
                "lossConfidencePercent": 94.0,
                "activeFaultsCount": 2,
                "warningCount": 2,
                "criticalCount": 0,
                "carbonOffsetTons": 1.15,
                "treesEquivalent": 53,
                "dailyRevenueUSD": 315.22,
                "efficiencyPercent": 96.2,
                "irradianceWm2": irradiance,
                "ambientTempC": 28.5,
                "pvTempC": 44.8,
                "performanceRatio": 84.6,
            },
            "chartData": [
                {
                    "time": "09:00",
                    "actualKW": 118.2,
                    "baselineKW": 120.0,
                    "irradianceWm2": 600,
                    "efficiencyPercent": 96.0,
                },
                {
                    "time": "12:00",
                    "actualKW": 204.6,
                    "baselineKW": 200.0,
                    "irradianceWm2": 865,
                    "efficiencyPercent": 96.5,
                },
                {
                    "time": "15:00",
                    "actualKW": current_power - 34.4,
                    "baselineKW": 150.0,
                    "irradianceWm2": 690,
                    "efficiencyPercent": 95.9,
                },
            ],
            "panels": build_default_panels(),
            "alerts": [
                {
                    "id": "DEMO-ALERT-01",
                    "code": "DEMO-THERMAL",
                    "title": "Showcase Thermal Alert",
                    "component": "Demo Array B / String 1",
                    "location": "Demo Zone",
                    "severity": "warning",
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                    "status": "active",
                    "description": "This alert is temporary showcase data.",
                    "recommendedAction": "Connect live telemetry before dispatching a technician.",
                }
            ],
            "insights": [
                {
                    "id": "DEMO-INSIGHT-01",
                    "title": "Showcase Soiling Insight",
                    "category": "efficiency",
                    "impact": "+3.8% estimated yield",
                    "confidencePercent": 94,
                    "description": "This insight is temporary showcase data.",
                    "recommendedAction": "Connect the ML pipeline to generate a live recommendation.",
                    "actionLabel": "View Demo Insight",
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                }
            ],
        }

    intraday = build_dashboard_intraday("2022-07-01")

    electricity_loss = round(float(intraday["loss_kwh"].sum()), 2)
    financial_loss = round(float(intraday["financial_loss_inr"].sum()), 2)
    loss_reason = str(intraday["reason"].iloc[0])
    loss_confidence = round(float(intraday["confidence"].iloc[0]) * 100, 1)

    return {
        "metrics": {
            "currentPowerKW": 188.4,
            "ratedCapacityKW": 250.0,
            "dailyGenerationKWh": round(
                float(intraday["actual_generation_kwh"].sum()), 2
            ),
            "dailyTargetKWh": round(
                float(intraday["expected_generation_kwh"].sum()), 2
            ),
            "electricityLossKWh": electricity_loss,
            "financialLossINR": financial_loss,
            "lossReason": loss_reason,
            "lossConfidencePercent": loss_confidence,
            "activeFaultsCount": 2,
            "warningCount": 2,
            "criticalCount": 0,
            "carbonOffsetTons": 0,
            "treesEquivalent": 0,
            "dailyRevenueUSD": 0,
            "efficiencyPercent": 0,
            "irradianceWm2": 0,
            "ambientTempC": 0,
            "pvTempC": 0,
            "performanceRatio": 0,
        },
        "chartData": [],
        "panels": build_default_panels(),
        "alerts": [],
        "insights": [],
    }
            
           
