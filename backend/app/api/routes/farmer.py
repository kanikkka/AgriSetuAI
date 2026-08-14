from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.farmer_profile import FarmerProfile
from app.schemas.farmer import FarmerProfileCreate, FarmerProfileResponse
from app.api.routes.auth import get_current_user


router = APIRouter(
    prefix="/farmer",
    tags=["Farmer"]
)


@router.post("/profile", response_model=FarmerProfileResponse)
def create_farmer_profile(
    profile_data: FarmerProfileCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    if current_user.role != "farmer":
        raise HTTPException(
            status_code=403,
            detail="Only farmers can create farmer profile"
        )

    existing_profile = db.query(FarmerProfile).filter(
        FarmerProfile.user_id == current_user.id
    ).first()

    if existing_profile:
        raise HTTPException(
            status_code=400,
            detail="Farmer profile already exists"
        )

    profile = FarmerProfile(
        user_id=current_user.id,
        phone=profile_data.phone,
        village=profile_data.village,
        district=profile_data.district,
        state=profile_data.state,
        language=profile_data.language,
        total_land_acres=profile_data.total_land_acres
    )

    db.add(profile)
    db.commit()
    db.refresh(profile)

    return profile
