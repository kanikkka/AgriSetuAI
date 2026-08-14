from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.buyer_demand import BuyerDemandIntent
from app.schemas.buyer_demand import (
    BuyerDemandCreate,
    BuyerDemandResponse
)
from app.api.routes.auth import get_current_user


router = APIRouter(
    prefix="/buyer-demands",
    tags=["Buyer Demand Intent"]
)


@router.post("", response_model=BuyerDemandResponse)
def create_buyer_demand(
    data: BuyerDemandCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    if current_user.role != "buyer":
        raise HTTPException(
            status_code=403,
            detail="Only buyers can create demand intent"
        )

    demand = BuyerDemandIntent(
        buyer_user_id=current_user.id,
        crop_name=data.crop_name,
        quantity_quintal=data.quantity_quintal,
        required_from_date=data.required_from_date,
        required_to_date=data.required_to_date,
        district=data.district,
        quality_grade=data.quality_grade,
        max_price_per_quintal=data.max_price_per_quintal,
        status="OPEN"
    )

    db.add(demand)
    db.commit()
    db.refresh(demand)

    return demand


@router.get("", response_model=list[BuyerDemandResponse])
def get_my_demands(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    if current_user.role != "buyer":
        return []

    return db.query(BuyerDemandIntent).filter(
        BuyerDemandIntent.buyer_user_id == current_user.id
    ).all()
