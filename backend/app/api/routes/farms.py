from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.farm import Farm
from app.models.farmer_profile import FarmerProfile
from app.schemas.farm import FarmCreate, FarmResponse
from app.api.routes.auth import get_current_user


router = APIRouter(
    prefix="/farms",
    tags=["Farms"]
)


@router.post("", response_model=FarmResponse)
def create_farm(
    farm_data: FarmCreate,
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

    farm = Farm(
        farmer_id=farmer_profile.id,
        farm_name=farm_data.farm_name,
        village=farm_data.village,
        district=farm_data.district,
        land_area_acres=farm_data.land_area_acres,
        latitude=farm_data.latitude,
        longitude=farm_data.longitude,
        soil_type=farm_data.soil_type
    )

    db.add(farm)
    db.commit()
    db.refresh(farm)

    return farm


@router.get("", response_model=list[FarmResponse])
def get_my_farms(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    farmer_profile = db.query(FarmerProfile).filter(
        FarmerProfile.user_id == current_user.id
    ).first()

    if not farmer_profile:
        return []

    farms = db.query(Farm).filter(
        Farm.farmer_id == farmer_profile.id
    ).all()

    return farms
