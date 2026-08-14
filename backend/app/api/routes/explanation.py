from fastapi import APIRouter

from app.services.explanation_engine import explain_recommendation


router = APIRouter(
    prefix="/explanation",
    tags=["Explainable AI"]
)


@router.get("")
def get_explanation(
    decision: str,
    current_price: float,
    expected_future_price: float,
    msp: float,
    weather_risk: str = "LOW",
    transport_cost: float = 500,
    storage_cost: float = 0
):
    return explain_recommendation(
        decision=decision,
        current_price=current_price,
        expected_future_price=expected_future_price,
        msp=msp,
        weather_risk=weather_risk,
        transport_cost=transport_cost,
        storage_cost=storage_cost
    )
