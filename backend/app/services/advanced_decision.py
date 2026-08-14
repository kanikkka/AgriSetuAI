from app.services.policy_signal import calculate_policy_signal


def advanced_decision(
    current_price: float,
    predicted_price: float,
    msp: float,
    weather_risk: str,
    quantity_quintal: float,
    storage_cost: float,
    transport_cost: float
):
    score = 0
    reasons = []

    # 1. Future price signal
    price_difference = predicted_price - current_price

    if price_difference >= 100:
        score += 30
        reasons.append("Future price is expected to increase significantly.")

    elif price_difference > 0:
        score += 15
        reasons.append("Future price is expected to increase.")

    else:
        score -= 25
        reasons.append("Future price is not expected to improve.")

    # 2. MSP signal
    policy = calculate_policy_signal(
        current_price=current_price,
        msp=msp
    )

    if policy["signal"] == "BELOW_MSP":
        score += 15
        reasons.append("Current market price is significantly below MSP.")

    elif policy["signal"] == "STRONG_MARKET":
        score -= 20
        reasons.append("Current market price is already well above MSP.")

    elif policy["signal"] == "ABOVE_MSP":
        score -= 10
        reasons.append("Current market price is above MSP.")

    # 3. Weather signal
    weather = weather_risk.upper()

    if weather == "HIGH":
        score -= 30
        reasons.append("High weather risk makes waiting risky.")

    elif weather == "MEDIUM":
        score -= 10
        reasons.append("Moderate weather risk exists.")

    else:
        score += 10
        reasons.append("Weather risk is low.")

    # 4. Storage economics
    future_revenue = predicted_price * quantity_quintal
    current_revenue = current_price * quantity_quintal

    hold_net = future_revenue - storage_cost - transport_cost
    sell_net = current_revenue - transport_cost

    expected_extra_profit = hold_net - sell_net

    if expected_extra_profit > 0:
        score += 20
        reasons.append(
            f"Waiting may generate approximately ?{round(expected_extra_profit, 2)} extra."
        )
    else:
        score -= 20
        reasons.append(
            "Storage cost may remove the benefit of waiting."
        )

    # Final decision
    if score >= 40:
        decision = "HOLD"

    elif score <= -20:
        decision = "SELL"

    else:
        decision = "WATCH"

    return {
        "decision": decision,
        "decision_score": score,
        "current_price": current_price,
        "predicted_price": predicted_price,
        "msp_signal": policy,
        "weather_risk": weather,
        "sell_now_net_return": round(sell_net, 2),
        "hold_net_return": round(hold_net, 2),
        "expected_extra_profit": round(expected_extra_profit, 2),
        "reasons": reasons
    }
