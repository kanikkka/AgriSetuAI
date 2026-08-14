from fastapi import APIRouter

from app.services.advanced_decision import advanced_decision


router = APIRouter(
    prefix="/advanced-decision",
    tags=["Advanced Decision Intelligence"]
)


@router.get("")
def get_advanced_decision(
    current_price: float,
    predicted_price: float,
    msp: float,
    weather_risk: str,
    quantity_quintal: float,
    storage_cost: float = 0,
    transport_cost: float = 0
):
    return advanced_decision(
        current_price=current_price,
        predicted_price=predicted_price,
        msp=msp,
        weather_risk=weather_risk,
        quantity_quintal=quantity_quintal,
        storage_cost=storage_cost,
        transport_cost=transport_cost
    )
