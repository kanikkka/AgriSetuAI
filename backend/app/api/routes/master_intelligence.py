from fastapi import APIRouter

from app.services.master_intelligence import build_master_farmer_intelligence


router = APIRouter(
    prefix="/farmer-intelligence",
    tags=["Master Farmer Intelligence"]
)


@router.get("")
def get_farmer_intelligence(
    day: int,
    month: int,
    previous_price: float,
    current_price: float,
    msp: float,
    weather_risk: str,
    quantity_quintal: float,
    storage_cost: float = 0,
    transport_cost: float = 0,
    data_quality_score: float = 80
):
    return build_master_farmer_intelligence(
        day=day,
        month=month,
        previous_price=previous_price,
        current_price=current_price,
        msp=msp,
        weather_risk=weather_risk,
        quantity_quintal=quantity_quintal,
        storage_cost=storage_cost,
        transport_cost=transport_cost,
        data_quality_score=data_quality_score
    )
