from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.storage_provider import StorageProvider
from app.services.storage_matching import match_storage_options


router = APIRouter(
    prefix="/storage-matching",
    tags=["Storage Matching"]
)


@router.get("")
def get_storage_matches(
    crop_name: str,
    quantity_quintal: float,
    district: str,
    storage_days: int = 7,
    db: Session = Depends(get_db)
):
    storages = db.query(StorageProvider).filter(
        StorageProvider.status == "AVAILABLE"
    ).all()

    matches = match_storage_options(
        storages=storages,
        crop_name=crop_name,
        quantity_quintal=quantity_quintal,
        district=district,
        storage_days=storage_days
    )

    return {
        "total_matches": len(matches),
        "matches": matches
    }
