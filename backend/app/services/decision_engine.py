def calculate_decision(
    current_price: float,
    msp: float,
    expected_future_price: float,
    storage_cost_per_quintal: float,
    storage_days: int
):
    storage_cost = storage_cost_per_quintal * storage_days

    future_net_price = expected_future_price - storage_cost

    gain_from_waiting = future_net_price - current_price

    if current_price >= msp and gain_from_waiting <= 0:
        decision = "SELL"
        reason = "Current market price is attractive and waiting gives no extra profit."

    elif future_net_price > current_price and gain_from_waiting >= 100:
        decision = "STORE"
        reason = "Expected future gain is higher even after storage cost."

    else:
        decision = "HOLD"
        reason = "Waiting may provide a better selling opportunity."

    return {
        "decision": decision,
        "current_price": current_price,
        "msp": msp,
        "expected_future_price": expected_future_price,
        "storage_cost": storage_cost,
        "future_net_price": future_net_price,
        "expected_gain_from_waiting": gain_from_waiting,
        "reason": reason
    }
