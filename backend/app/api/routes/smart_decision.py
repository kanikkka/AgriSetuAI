from fastapi import APIRouter

from ml.src.predict import predict_price
from app.services.decision_engine import calculate_decision


router = APIRouter(
    prefix="/smart-decision",
    tags=["Smart Farmer Decision"]
)


@router.get("")
def smart_decision(
    day: int,
    month: int,
    previous_price: float,
    current_price: float,
    msp: float,
    storage_cost_per_quintal: float = 2,
    storage_days: int = 30
):
    expected_future_price = predict_price(
        day=day,
        month=month,
        previous_price=previous_price
    )

    decision = calculate_decision(
        current_price=current_price,
        msp=msp,
        expected_future_price=expected_future_price,
        storage_cost_per_quintal=storage_cost_per_quintal,
        storage_days=storage_days
    )

    return {
        "prediction": {
            "expected_future_price": expected_future_price
        },
        "decision": decision
    }
