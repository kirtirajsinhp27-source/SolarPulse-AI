import uuid
from sqlalchemy import Column, String, Float, DateTime, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.database import Base

class SolarPanel(Base):
    __tablename__ = "solar_panels"
    __table_args__ = {'extend_existing': True}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    string_id = Column(String, nullable=False)
    panel_id = Column(String, nullable=False)
    capacity_kw = Column(Float, nullable=True)

class DiagnosticReport(Base):
    __tablename__ = "diagnostic_reports"
    __table_args__ = {'extend_existing': True}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    string_id = Column(String, nullable=False)
    fault_type = Column(String, nullable=False)
    efficiency_loss = Column(Float, nullable=False)
    power_output_kw = Column(Float, nullable=False)
    heatmap_matrix = Column(JSON, nullable=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())