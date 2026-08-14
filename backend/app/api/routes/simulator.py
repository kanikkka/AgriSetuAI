from fastapi import APIRouter, Query

from app.services.simulator import simulate_scenarios


router = APIRouter(
    prefix="/simulator",
    tags=["What If Simulator"]
)


@router.get("")
def what_if_simulator(
    current_price: float,
    quantity_quintal: float,
    predicted_prices: list[float] = Query(...),
    storage_cost_per_quintal_per_day: float = 1.5,
    transport_cost: float = 500
):
    result = simulate_scenarios(
        current_price=current_price,
        predicted_prices=predicted_prices,
        quantity_quintal=quantity_quintal,
        storage_cost_per_quintal_per_day=storage_cost_per_quintal_per_day,
        transport_cost=transport_cost
    )

    best_option = max(
        result["future_options"] + [result["today"]],
        key=lambda x: x["net_return"]
    )

    return {
        "best_option": best_option,
        "comparison": result
    }
