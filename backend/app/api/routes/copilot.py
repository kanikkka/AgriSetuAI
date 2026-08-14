from fastapi import APIRouter

from app.services.copilot_service import handle_farmer_query


router = APIRouter(
    prefix="/copilot",
    tags=["Farmer Copilot"]
)


@router.get("")
def farmer_copilot(
    message: str,
    current_price: float,
    previous_price: float,
    day: int,
    month: int,
    msp: float,
    language: str = "english"
):
    return handle_farmer_query(
        message=message,
        current_price=current_price,
        previous_price=previous_price,
        day=day,
        month=month,
        msp=msp,
        language=language
    )
