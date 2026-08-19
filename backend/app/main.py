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
    return {
        "metrics": {
            "currentPowerKW": 188.4,
            "ratedCapacityKW": 250.0,
            "dailyGenerationKWh": 1432.8,
            "dailyTargetKWh": 1650.0,
            "activeFaultsCount": 2,
            "warningCount": 2,
            "criticalCount": 0,
            "carbonOffsetTons": 1.15,
            "treesEquivalent": 53,
            "dailyRevenueUSD": 315.22,
            "efficiencyPercent": 96.2,
            "irradianceWm2": 842,
            "ambientTempC": 28.5,
            "pvTempC": 44.8,
            "performanceRatio": 84.6,
        },
        "chartData": [
            {"time": "06:00", "actualKW": 4.2, "baselineKW": 5.0, "irradianceWm2": 120, "efficiencyPercent": 92.1},
            {"time": "07:00", "actualKW": 22.8, "baselineKW": 25.0, "irradianceWm2": 240, "efficiencyPercent": 94.3},
            {"time": "08:00", "actualKW": 68.5, "baselineKW": 65.0, "irradianceWm2": 410, "efficiencyPercent": 95.8},
            {"time": "09:00", "actualKW": 118.2, "baselineKW": 120.0, "irradianceWm2": 600, "efficiencyPercent": 96.0},
            {"time": "10:00", "actualKW": 162.4, "baselineKW": 160.0, "irradianceWm2": 740, "efficiencyPercent": 96.4},
            {"time": "11:00", "actualKW": 185.0, "baselineKW": 182.0, "irradianceWm2": 810, "efficiencyPercent": 96.1},
            {"time": "12:00", "actualKW": 204.6, "baselineKW": 200.0, "irradianceWm2": 865, "efficiencyPercent": 96.5},
            {"time": "13:00", "actualKW": 198.2, "baselineKW": 195.0, "irradianceWm2": 850, "efficiencyPercent": 96.2},
            {"time": "14:00", "actualKW": 188.4, "baselineKW": 180.0, "irradianceWm2": 842, "efficiencyPercent": 96.2},
            {"time": "15:00", "actualKW": 154.0, "baselineKW": 150.0, "irradianceWm2": 690, "efficiencyPercent": 95.9},
            {"time": "16:00", "actualKW": 98.6, "baselineKW": 95.0, "irradianceWm2": 480, "efficiencyPercent": 95.2},
            {"time": "17:00", "actualKW": 42.1, "baselineKW": 45.0, "irradianceWm2": 260, "efficiencyPercent": 93.8},
            {"time": "18:00", "actualKW": 8.5, "baselineKW": 10.0, "irradianceWm2": 110, "efficiencyPercent": 90.5},
        ],
        "panels": [
            {"id": "MOD-A01", "arrayId": "Array A", "stringId": "STR-A1", "row": 1, "col": 1, "status": "optimal", "voltageV": 41.8, "currentA": 9.6, "powerW": 401.3, "temperatureC": 43.5, "efficiencyPercent": 97.2, "mpptChannel": "MPPT-1A"},
            {"id": "MOD-A02", "arrayId": "Array A", "stringId": "STR-A1", "row": 1, "col": 2, "status": "optimal", "voltageV": 41.9, "currentA": 9.5, "powerW": 398.1, "temperatureC": 43.8, "efficiencyPercent": 96.8, "mpptChannel": "MPPT-1A"},
            {"id": "MOD-B05", "arrayId": "Array B", "stringId": "STR-B1", "row": 1, "col": 5, "status": "warning", "voltageV": 37.2, "currentA": 8.1, "powerW": 301.3, "temperatureC": 56.4, "efficiencyPercent": 81.2, "issueDescription": "Thermal hotspot detected.", "mpptChannel": "MPPT-2A"},
        ],
        "alerts": [
            {
                "id": "ALT-8092",
                "code": "WARN-THRM-05",
                "title": "Cell Hotspot Anomaly Detected",
                "component": "Module MOD-B05 (Array B / String 1)",
                "location": "Rooftop West Wing Zone 2",
                "severity": "warning",
                "timestamp": "14:18 (12 mins ago)",
                "status": "active",
                "description": "Operating temperature reached 56.4°C.",
                "recommendedAction": "Inspect with thermal imager.",
            }
        ],
        "insights": [
            {
                "id": "INS-01",
                "title": "Soiling Mitigation Opportunity",
                "category": "efficiency",
                "impact": "+3.8% Yield (+48 kWh/day)",
                "confidencePercent": 94,
                "description": "AI optical and string telemetry analysis indicates high dust density on Array C.",
                "recommendedAction": "Dispatch automated robotic cleaning for Array C at 21:00.",
                "actionLabel": "Schedule Cleaning",
                "timestamp": "Updated 10m ago",
            }
        ],
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
