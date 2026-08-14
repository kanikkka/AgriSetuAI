from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.supply_intent import SupplyIntent
from app.models.buyer_demand import BuyerDemandIntent
from app.services.heatmap_service import build_heatmap_data


router = APIRouter(
    prefix="/market-map",
    tags=["Supply Demand Heatmap"]
)


@router.get("/heatmap")
def get_supply_demand_heatmap(
    db: Session = Depends(get_db)
):
    supplies = db.query(SupplyIntent).filter(
        SupplyIntent.status == "OPEN"
    ).all()

    demands = db.query(BuyerDemandIntent).filter(
        BuyerDemandIntent.status == "OPEN"
    ).all()

    heatmap = build_heatmap_data(
        supplies,
        demands
    )

    return {
        "districts": heatmap
    }
