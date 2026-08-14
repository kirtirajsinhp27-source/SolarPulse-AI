import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, Integer, JSON
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base

class PanelTelemetry(Base):
    __tablename__ = "panel_telemetry"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    string_id = Column(String(50), nullable=False, index=True) # e.g., "STRING_A"
    panel_id = Column(String(50), nullable=False, index=True)  # e.g., "PANEL_01"
    voltage = Column(Float, nullable=False)
    current = Column(Float, nullable=False)
    temperature = Column(Float, nullable=False)
    irradiance = Column(Float, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)

class DiagnosticReport(Base):
    __tablename__ = "diagnostic_reports"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    string_id = Column(String(50), nullable=False)
    fault_type = Column(String(100), nullable=False) # e.g., "Partial Shading", "Degradation"
    efficiency_loss = Column(Float, nullable=False)  # Percentage loss (0 - 100)
    power_output_kw = Column(Float, nullable=False)
    heatmap_matrix = Column(JSON, nullable=True)     # 2D matrix for spatial panel grid
    timestamp = Column(DateTime, default=datetime.utcnow)