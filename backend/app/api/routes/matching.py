from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.supply_intent import SupplyIntent
from app.models.buyer_demand import BuyerDemandIntent
from app.services.matching_engine import calculate_match_score


router = APIRouter(
    prefix="/matching",
    tags=["Farmer Buyer Matching"]
)


@router.get("")
def get_matches(
    db: Session = Depends(get_db)
):
    supplies = db.query(SupplyIntent).filter(
        SupplyIntent.status == "OPEN"
    ).all()

    demands = db.query(BuyerDemandIntent).filter(
        BuyerDemandIntent.status == "OPEN"
    ).all()

    matches = []

    for supply in supplies:
        for demand in demands:

            if supply.crop_name.lower() != demand.crop_name.lower():
                continue

            result = calculate_match_score(
                supply,
                demand
            )

            if result["score"] >= 50:
                matches.append({
                    "supply_id": supply.id,
                    "demand_id": demand.id,
                    "crop": supply.crop_name,
                    "farmer_quantity": supply.quantity_quintal,
                    "buyer_requirement": demand.quantity_quintal,
                    "match_score": result["score"],
                    "reasons": result["reasons"]
                })

    matches.sort(
        key=lambda x: x["match_score"],
        reverse=True
    )

    return {
        "total_matches": len(matches),
        "matches": matches
    }
