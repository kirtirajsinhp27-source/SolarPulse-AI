import asyncio
from datetime import datetime, timedelta, timezone
from typing import List
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.database import AsyncSessionLocal
from app.crud.crud_telemetry import get_telemetry_history

router = APIRouter(prefix="/ws", tags=["Real-Time Telemetry Stream"])

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            await connection.send_json(message)

manager = ConnectionManager()

@router.websocket("/telemetry/{string_id}")
async def websocket_telemetry_endpoint(websocket: WebSocket, string_id: str):
    """
    Replays persisted telemetry records in chronological order. The frontend can
    use this endpoint as a live playback stream for previously collected data.
    """
    await manager.connect(websocket)
    try:
        async with AsyncSessionLocal() as db:
            timeframe = websocket.query_params.get("timeframe", "Today")
            durations = {
                "Today": timedelta(days=1),
                "7 Days": timedelta(days=7),
                "30 Days": timedelta(days=30),
                "Year": timedelta(days=365),
            }
            since = datetime.now(timezone.utc) - durations.get(timeframe, durations["Today"])
            try:
                records = await get_telemetry_history(db, string_id, since, 5000)
            except Exception:
                records = []
            if not records:
                await websocket.send_json({"status": "NO_DATA", "string_id": string_id})
                while True:
                    await asyncio.sleep(10)

            for record in records:
                if isinstance(record, dict):
                    voltage = record["voltage"]
                    current = record["current"]
                    power_kw = record.get("power_kw")
                    generation_kwh = record.get("generation_kwh")
                    irradiance = record["irradiance"]
                    temperature = record["temperature"]
                    timestamp = record.get("timestamp")
                else:
                    voltage = record.voltage
                    current = record.current
                    power_kw = None
                    generation_kwh = None
                    irradiance = record.irradiance
                    temperature = record.temperature
                    timestamp = record.timestamp.isoformat() if record.timestamp else None
                record_id = record["id"] if isinstance(record, dict) else str(record.id)
                record_string_id = record["string_id"] if isinstance(record, dict) else record.string_id
                record_panel_id = record["panel_id"] if isinstance(record, dict) else record.panel_id
                await websocket.send_json({
                    "id": record_id,
                    "string_id": record_string_id,
                    "panel_id": record_panel_id,
                    "voltage": voltage,
                    "current": current,
                    "power_kw": power_kw,
                    "generation_kwh": generation_kwh,
                    "performance_ratio": record.get("performance_ratio") if isinstance(record, dict) else None,
                    "irradiance": irradiance,
                    "temperature": temperature,
                    "timestamp": timestamp,
                    "status": "OPERATIONAL" if irradiance >= 200 else "LOW_IRRADIANCE",
                })
                await asyncio.sleep(1.5)
            
    except WebSocketDisconnect:
        manager.disconnect(websocket)