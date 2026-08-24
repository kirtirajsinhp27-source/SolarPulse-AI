from datetime import datetime
from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, ConfigDict
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.solar import Inverter


router = APIRouter(
    prefix="/inverters",
    tags=["Inverters"],
)


class InverterCreate(BaseModel):
    inverter_id: str
    name: str
    manufacturer: str
    model: str
    rated_capacity_kw: float
    connection_type: str
    host: str | None = None
    port: str | None = None
    unit_id: str | None = None


class InverterResponse(InverterCreate):
    id: UUID
    created_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)


@router.post("", response_model=InverterResponse)
async def create_inverter(
    data: InverterCreate,
    db: AsyncSession = Depends(get_db),
):
    inverter = Inverter(
        inverter_id=data.inverter_id,
        name=data.name,
        manufacturer=data.manufacturer,
        model=data.model,
        rated_capacity_kw=data.rated_capacity_kw,
        connection_type=data.connection_type,
        host=data.host,
        port=data.port,
        unit_id=data.unit_id,
    )

    db.add(inverter)

    try:
        await db.commit()
        await db.refresh(inverter)
    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            status_code=409,
            detail=f"Inverter ID '{data.inverter_id}' already exists.",
        )

    return inverter


@router.get("", response_model=List[InverterResponse])
async def get_inverters(
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Inverter).order_by(Inverter.created_at)
    )

    return result.scalars().all()