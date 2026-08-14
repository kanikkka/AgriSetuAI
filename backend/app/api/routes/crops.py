from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.crop import Crop
from app.models.farm import Farm
from app.models.farmer_profile import FarmerProfile
from app.schemas.crop import CropCreate, CropResponse
from app.api.routes.auth import get_current_user


router = APIRouter(
    prefix="/crops",
    tags=["Crops"]
)


@router.post("", response_model=CropResponse)
def create_crop(
    crop_data: CropCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    farmer_profile = db.query(FarmerProfile).filter(
        FarmerProfile.user_id == current_user.id
    ).first()

    if not farmer_profile:
        raise HTTPException(
            status_code=400,
            detail="Create farmer profile first"
        )

    farm = db.query(Farm).filter(
        Farm.id == crop_data.farm_id,
        Farm.farmer_id == farmer_profile.id
    ).first()

    if not farm:
        raise HTTPException(
            status_code=404,
            detail="Farm not found"
        )

    crop = Crop(
        farm_id=crop_data.farm_id,
        crop_name=crop_data.crop_name,
        quantity_quintal=crop_data.quantity_quintal,
        expected_harvest_date=crop_data.expected_harvest_date,
        crop_status=crop_data.crop_status,
        storage_available=crop_data.storage_available
    )

    db.add(crop)
    db.commit()
    db.refresh(crop)

    return crop


@router.get("", response_model=list[CropResponse])
def get_my_crops(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    farmer_profile = db.query(FarmerProfile).filter(
        FarmerProfile.user_id == current_user.id
    ).first()

    if not farmer_profile:
        return []

    farm_ids = [
        farm.id
        for farm in db.query(Farm).filter(
            Farm.farmer_id == farmer_profile.id
        ).all()
    ]

    if not farm_ids:
        return []

    crops = db.query(Crop).filter(
        Crop.farm_id.in_(farm_ids)
    ).all()

    return crops
