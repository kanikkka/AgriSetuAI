from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.storage_provider import StorageProvider
from app.schemas.storage_provider import (
    StorageProviderCreate,
    StorageProviderResponse
)
from app.api.routes.auth import get_current_user


router = APIRouter(
    prefix="/storage-providers",
    tags=["Storage Providers"]
)


@router.post("", response_model=StorageProviderResponse)
def create_storage_provider(
    data: StorageProviderCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    if current_user.role != "storage_provider":
        raise HTTPException(
            status_code=403,
            detail="Only storage providers can add storage"
        )

    storage = StorageProvider(
        user_id=current_user.id,
        storage_name=data.storage_name,
        district=data.district,
        supported_crop=data.supported_crop,
        total_capacity_quintal=data.total_capacity_quintal,
        available_capacity_quintal=data.available_capacity_quintal,
        cost_per_quintal_per_day=data.cost_per_quintal_per_day,
        status="AVAILABLE"
    )

    db.add(storage)
    db.commit()
    db.refresh(storage)

    return storage


@router.get("", response_model=list[StorageProviderResponse])
def get_storage_providers(
    db: Session = Depends(get_db)
):
    return db.query(StorageProvider).filter(
        StorageProvider.status == "AVAILABLE"
    ).all()
