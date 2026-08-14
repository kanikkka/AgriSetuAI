from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.mandi_price import MandiPrice


router = APIRouter(
    prefix="/mandi-recommendation",
    tags=["Mandi Recommendation"]
)


@router.get("")
def recommend_mandi(
    crop_name: str,
    quantity_quintal: float,
    transport_cost_per_km: float = 20,
    db: Session = Depends(get_db)
):
    prices = db.query(MandiPrice).filter(
        MandiPrice.crop_name == crop_name
    ).all()

    if not prices:
        return {
            "message": "No mandi prices found for this crop"
        }

    mandi_distances = {
        "Khanna": 25,
        "Ludhiana": 15,
        "Patiala": 60
    }

    results = []

    for price in prices:
        distance = mandi_distances.get(
            price.mandi_name,
            30
        )

        gross_revenue = (
            price.modal_price * quantity_quintal
        )

        transport_cost = (
            distance * transport_cost_per_km
        )

        net_return = (
            gross_revenue - transport_cost
        )

        results.append({
            "mandi": price.mandi_name,
            "district": price.district,
            "modal_price": price.modal_price,
            "distance_km": distance,
            "transport_cost": transport_cost,
            "gross_revenue": gross_revenue,
            "net_return": net_return
        })

    best_mandi = max(
        results,
        key=lambda x: x["net_return"]
    )

    return {
        "crop": crop_name,
        "quantity_quintal": quantity_quintal,
        "best_mandi": best_mandi,
        "all_options": results
    }
