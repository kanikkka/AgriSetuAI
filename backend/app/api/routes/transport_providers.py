from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.transport_provider import TransportProvider
from app.schemas.transport_provider import (
    TransportProviderCreate,
    TransportProviderResponse
)
from app.api.routes.auth import get_current_user


router = APIRouter(
    prefix="/transport-providers",
    tags=["Transport Providers"]
)


@router.post("", response_model=TransportProviderResponse)
def create_transport_provider(
    data: TransportProviderCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    if current_user.role != "transport_provider":
        raise HTTPException(
            status_code=403,
            detail="Only transport providers can add transport"
        )

    provider = TransportProvider(
        user_id=current_user.id,
        provider_name=data.provider_name,
        vehicle_type=data.vehicle_type,
        capacity_quintal=data.capacity_quintal,
        district=data.district,
        cost_per_km=data.cost_per_km,
        status="AVAILABLE"
    )

    db.add(provider)
    db.commit()
    db.refresh(provider)

    return provider


@router.get("", response_model=list[TransportProviderResponse])
def get_transport_providers(
    db: Session = Depends(get_db)
):
    return db.query(TransportProvider).filter(
        TransportProvider.status == "AVAILABLE"
    ).all()
