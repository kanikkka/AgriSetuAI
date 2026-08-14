def simulate_scenarios(
    current_price: float,
    predicted_prices: list[float],
    quantity_quintal: float,
    storage_cost_per_quintal_per_day: float,
    transport_cost: float
):
    results = []

    for day_index, future_price in enumerate(predicted_prices):
        days_waited = day_index + 1

        storage_cost = (
            storage_cost_per_quintal_per_day
            * quantity_quintal
            * days_waited
        )

        gross_revenue = future_price * quantity_quintal

        net_return = (
            gross_revenue
            - storage_cost
            - transport_cost
        )

        results.append({
            "days_waited": days_waited,
            "predicted_price": future_price,
            "gross_revenue": gross_revenue,
            "storage_cost": storage_cost,
            "transport_cost": transport_cost,
            "net_return": net_return
        })

    today_net_return = (
        current_price * quantity_quintal
        - transport_cost
    )

    return {
        "today": {
            "days_waited": 0,
            "price": current_price,
            "net_return": today_net_return
        },
        "future_options": results
    }
