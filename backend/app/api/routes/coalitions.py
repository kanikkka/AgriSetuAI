from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.supply_intent import SupplyIntent
from app.models.buyer_demand import BuyerDemandIntent
from app.services.coalition_engine import build_coalitions


router = APIRouter(
    prefix="/coalitions",
    tags=["Farmer Coalitions"]
)


@router.get("")
def get_farmer_coalitions(
    db: Session = Depends(get_db)
):
    supplies = db.query(SupplyIntent).filter(
        SupplyIntent.status == "OPEN"
    ).all()

    demands = db.query(BuyerDemandIntent).filter(
        BuyerDemandIntent.status == "OPEN"
    ).all()

    coalitions = build_coalitions(
        supplies,
        demands
    )

    return {
        "total_coalitions": len(coalitions),
        "coalitions": coalitions
    }
