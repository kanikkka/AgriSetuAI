from fastapi import APIRouter

from app.services.decision_engine import calculate_decision


router = APIRouter(
    prefix="/decision",
    tags=["Sell Hold Store Decision"]
)


@router.get("/sell-hold-store")
def sell_hold_store(
    current_price: float,
    msp: float,
    expected_future_price: float,
    storage_cost_per_quintal: float = 2,
    storage_days: int = 30
):
    return calculate_decision(
        current_price=current_price,
        msp=msp,
        expected_future_price=expected_future_price,
        storage_cost_per_quintal=storage_cost_per_quintal,
        storage_days=storage_days
    )
