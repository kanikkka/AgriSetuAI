from fastapi import APIRouter

from app.services.selling_options import compare_selling_options


router = APIRouter(
    prefix="/selling-options",
    tags=["Selling Options Comparison"]
)


@router.get("/compare")
def compare_options(
    quantity_quintal: float,
    mandi_price: float,
    mandi_transport_cost: float,
    buyer_price: float | None = None,
    buyer_transport_cost: float = 0,
    coalition_price: float | None = None,
    coalition_cost: float = 0,
    future_price: float | None = None,
    storage_cost: float = 0
):
    return compare_selling_options(
        quantity_quintal=quantity_quintal,
        mandi_price=mandi_price,
        mandi_transport_cost=mandi_transport_cost,
        buyer_price=buyer_price,
        buyer_transport_cost=buyer_transport_cost,
        coalition_price=coalition_price,
        coalition_cost=coalition_cost,
        future_price=future_price,
        storage_cost=storage_cost
    )
