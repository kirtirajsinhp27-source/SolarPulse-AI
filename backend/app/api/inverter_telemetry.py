from datetime import datetime, timezone
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.solar import Inverter, InverterTelemetry


router = APIRouter(
    prefix="/inverters",
    tags=["Inverter Telemetry"],
)


class InverterTelemetryCreate(BaseModel):
    dc_voltage_v: Optional[float] = Field(default=None, ge=0)
    dc_current_a: Optional[float] = Field(default=None, ge=0)
    dc_power_kw: Optional[float] = Field(default=None, ge=0)

    ac_power_kw: Optional[float] = Field(default=None, ge=0)
    efficiency_percent: Optional[float] = Field(default=None, ge=0, le=100)

    temperature_c: Optional[float] = None
    grid_frequency_hz: Optional[float] = Field(default=None, ge=0)
    power_factor: Optional[float] = Field(default=None, ge=-1, le=1)

    mppt1_voltage_v: Optional[float] = Field(default=None, ge=0)
    mppt1_current_a: Optional[float] = Field(default=None, ge=0)
    mppt1_power_kw: Optional[float] = Field(default=None, ge=0)

    mppt2_voltage_v: Optional[float] = Field(default=None, ge=0)
    mppt2_current_a: Optional[float] = Field(default=None, ge=0)
    mppt2_power_kw: Optional[float] = Field(default=None, ge=0)

    timestamp: Optional[datetime] = None


class InverterTelemetryResponse(InverterTelemetryCreate):
    id: UUID
    inverter_id: str

    model_config = {
        "from_attributes": True
    }


@router.post(
    "/{inverter_id}/telemetry",
    response_model=InverterTelemetryResponse,
)
async def receive_inverter_telemetry(
    inverter_id: str,
    telemetry: InverterTelemetryCreate,
    db: AsyncSession = Depends(get_db),
):
    """
    Receive telemetry from an inverter or IoT gateway
    and persist it in PostgreSQL.
    """

    result = await db.execute(
        select(Inverter).where(
            Inverter.inverter_id == inverter_id
        )
    )

    inverter = result.scalar_one_or_none()

    if inverter is None:
        raise HTTPException(
            status_code=404,
            detail=f"Inverter '{inverter_id}' is not registered.",
        )

    telemetry_record = InverterTelemetry(
        inverter_id=inverter_id,
        dc_voltage_v=telemetry.dc_voltage_v,
        dc_current_a=telemetry.dc_current_a,
        dc_power_kw=telemetry.dc_power_kw,
        ac_power_kw=telemetry.ac_power_kw,
        efficiency_percent=telemetry.efficiency_percent,
        temperature_c=telemetry.temperature_c,
        grid_frequency_hz=telemetry.grid_frequency_hz,
        power_factor=telemetry.power_factor,
        mppt1_voltage_v=telemetry.mppt1_voltage_v,
        mppt1_current_a=telemetry.mppt1_current_a,
        mppt1_power_kw=telemetry.mppt1_power_kw,
        mppt2_voltage_v=telemetry.mppt2_voltage_v,
        mppt2_current_a=telemetry.mppt2_current_a,
        mppt2_power_kw=telemetry.mppt2_power_kw,
        timestamp=telemetry.timestamp or datetime.now(timezone.utc),
    )

    db.add(telemetry_record)
    await db.commit()
    await db.refresh(telemetry_record)

    return telemetry_record
@router.get(
    "/{inverter_id}/telemetry",
    response_model=list[InverterTelemetryResponse],
)
async def get_inverter_telemetry(
    inverter_id: str,
    limit: int = 50,
    db: AsyncSession = Depends(get_db),
):
    """
    Return recent telemetry records for a registered inverter.
    """

    result = await db.execute(
        select(Inverter).where(
            Inverter.inverter_id == inverter_id
        )
    )

    inverter = result.scalar_one_or_none()

    if inverter is None:
        raise HTTPException(
            status_code=404,
            detail=f"Inverter '{inverter_id}' is not registered.",
        )

    telemetry_result = await db.execute(
        select(InverterTelemetry)
        .where(InverterTelemetry.inverter_id == inverter_id)
        .order_by(InverterTelemetry.timestamp.desc())
        .limit(limit)
    )

    records = telemetry_result.scalars().all()

    return list(records)