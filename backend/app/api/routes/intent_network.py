from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.supply_intent import SupplyIntent
from app.models.buyer_demand import BuyerDemandIntent
from app.services.intent_network import build_intent_network
from app.services.coalition_engine import build_coalitions


router = APIRouter(
    prefix="/intent-network",
    tags=["Future Agricultural Intent Network"]
)


@router.get("/summary")
def get_intent_network_summary(
    db: Session = Depends(get_db)
):
    supplies = db.query(SupplyIntent).filter(
        SupplyIntent.status == "OPEN"
    ).all()

    demands = db.query(BuyerDemandIntent).filter(
        BuyerDemandIntent.status == "OPEN"
    ).all()

    market_network = build_intent_network(
        supplies,
        demands
    )

    coalitions = build_coalitions(
        supplies,
        demands
    )

    total_supply = sum(
        item.quantity_quintal
        for item in supplies
    )

    total_demand = sum(
        item.quantity_quintal
        for item in demands
    )

    return {
        "total_future_supply_quintal": total_supply,
        "total_future_demand_quintal": total_demand,
        "crop_network": market_network,
        "coalition_opportunities": coalitions
    }
