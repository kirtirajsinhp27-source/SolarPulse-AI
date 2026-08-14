import asyncio
import random
from typing import List
from fastapi import APIRouter, WebSocket, WebSocketDisconnect

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
    Streams live telemetry metrics for a given solar string ID every 1.5 seconds.
    Simulates real-time sensor variations (Voltage, Current, Temp, Irradiance).
    """
    await manager.connect(websocket)
    try:
        while True:
            # Simulate real-time solar panel fluctuations
            base_irradiance = random.uniform(800.0, 1000.0)
            simulated_data = {
                "string_id": string_id,
                "voltage": round(random.uniform(36.0, 40.0), 2),
                "current": round(random.uniform(7.5, 9.2), 2),
                "irradiance": round(base_irradiance, 1),
                "temperature": round(random.uniform(35.0, 52.0), 1),
                "status": "OPERATIONAL" if base_irradiance > 850 else "WARNING_LOW_IRRADIANCE"
            }
            
            await websocket.send_json(simulated_data)
            await asyncio.sleep(1.5)  # Stream interval
            
    except WebSocketDisconnect:
        manager.disconnect(websocket)