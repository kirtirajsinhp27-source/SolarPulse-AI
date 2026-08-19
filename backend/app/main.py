import math
import time
from datetime import datetime, timezone

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api import diagnostics, websockets, predictions, intraday

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
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
                "activeFaultsCount": 1,
                "warningCount": 1,
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
                {"time": "09:00", "actualKW": 118.2, "baselineKW": 120.0, "irradianceWm2": 600, "efficiencyPercent": 96.0},
                {"time": "12:00", "actualKW": 204.6, "baselineKW": 200.0, "irradianceWm2": 865, "efficiencyPercent": 96.5},
                {"time": "15:00", "actualKW": current_power - 34.4, "baselineKW": 150.0, "irradianceWm2": 690, "efficiencyPercent": 95.9},
            ],
            "panels": [
                {"id": "DEMO-A01", "arrayId": "Demo Array A", "stringId": "DEMO-STR-A1", "row": 1, "col": 1, "status": "optimal", "voltageV": 41.8, "currentA": 9.6, "powerW": round(401.3 + (wave * 3), 1), "temperatureC": round(43.5 + (wave * 0.5), 1), "efficiencyPercent": 97.2, "mpptChannel": "DEMO-MPPT-1"},
                {"id": "DEMO-B05", "arrayId": "Demo Array B", "stringId": "DEMO-STR-B1", "row": 1, "col": 5, "status": "warning", "voltageV": 37.2, "currentA": 8.1, "powerW": 301.3, "temperatureC": 56.4, "efficiencyPercent": 81.2, "issueDescription": "Showcase thermal hotspot." , "mpptChannel": "DEMO-MPPT-2"},
            ],
            "alerts": [
                {"id": "DEMO-ALERT-01", "code": "DEMO-THERMAL", "title": "Showcase Thermal Alert", "component": "Demo Array B / String 1", "location": "Demo Zone", "severity": "warning", "timestamp": datetime.now(timezone.utc).isoformat(), "status": "active", "description": "This alert is temporary showcase data.", "recommendedAction": "Connect live telemetry before dispatching a technician."}
            ],
            "insights": [
                {"id": "DEMO-INSIGHT-01", "title": "Showcase Soiling Insight", "category": "efficiency", "impact": "+3.8% estimated yield", "confidencePercent": 94, "description": "This insight is temporary showcase data.", "recommendedAction": "Connect the ML pipeline to generate a live recommendation.", "actionLabel": "View Demo Insight", "timestamp": datetime.now(timezone.utc).isoformat()}
            ],
        }

    return {
        "metrics": {
            "currentPowerKW": 0,
            "ratedCapacityKW": 0,
            "dailyGenerationKWh": 0,
            "dailyTargetKWh": 0,
            "activeFaultsCount": 0,
            "warningCount": 0,
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
        "panels": [],
        "alerts": [],
        "insights": [],
    }

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(diagnostics.router, prefix=settings.API_V1_STR)
app.include_router(predictions.router, prefix=settings.API_V1_STR)
app.include_router(intraday.router, prefix=settings.API_V1_STR)
app.include_router(websockets.router)  # Accessible via ws://localhost:8000/ws/telemetry/{string_id}

@app.get("/")
async def root():
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs_url": "/docs"
    }
