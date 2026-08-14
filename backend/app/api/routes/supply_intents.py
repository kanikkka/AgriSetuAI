from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.supply_intent import SupplyIntent
from app.models.farmer_profile import FarmerProfile
from app.schemas.supply_intent import (
    SupplyIntentCreate,
    SupplyIntentResponse
)
from app.api.routes.auth import get_current_user


router = APIRouter(
    prefix="/supply-intents",
    tags=["Future Supply Intent"]
)


@router.post("", response_model=SupplyIntentResponse)
def create_supply_intent(
    data: SupplyIntentCreate,
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

    intent = SupplyIntent(
        farmer_id=farmer_profile.id,
        crop_name=data.crop_name,
        quantity_quintal=data.quantity_quintal,
        available_date=data.available_date,
        village=data.village,
        district=data.district,
        quality_grade=data.quality_grade,
        status="OPEN"
    )

    db.add(intent)
    db.commit()
    db.refresh(intent)

    return intent


@router.get("", response_model=list[SupplyIntentResponse])
def get_my_supply_intents(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    farmer_profile = db.query(FarmerProfile).filter(
        FarmerProfile.user_id == current_user.id
    ).first()

    if not farmer_profile:
        return []

    return db.query(SupplyIntent).filter(
        SupplyIntent.farmer_id == farmer_profile.id
    ).all()
