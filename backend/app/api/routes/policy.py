from fastapi import APIRouter

from app.services.policy_signal import calculate_policy_signal


router = APIRouter(
    prefix="/policy",
    tags=["MSP Policy Intelligence"]
)


@router.get("/msp-signal")
def get_msp_policy_signal(
    current_price: float,
    msp: float
):
    return calculate_policy_signal(
        current_price=current_price,
        msp=msp
    )
