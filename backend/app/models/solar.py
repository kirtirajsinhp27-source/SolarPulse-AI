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

class Inverter(Base):
    __tablename__ = "inverters"
    __table_args__ = {'extend_existing': True}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    inverter_id = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=False)
    manufacturer = Column(String, nullable=False)
    model = Column(String, nullable=False)
    rated_capacity_kw = Column(Float, nullable=False)
    connection_type = Column(String, nullable=False)
    host = Column(String, nullable=True)
    port = Column(String, nullable=True)
    unit_id = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())