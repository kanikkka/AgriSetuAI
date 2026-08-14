def explain_recommendation(
    decision: str,
    current_price: float,
    expected_future_price: float,
    msp: float,
    weather_risk: str,
    transport_cost: float,
    storage_cost: float
):
    reasons = []

    price_change = expected_future_price - current_price

    if price_change > 0:
        reasons.append(
            f"Expected future price is ?{round(price_change, 2)} higher than current price."
        )
    elif price_change < 0:
        reasons.append(
            f"Expected future price is ?{round(abs(price_change), 2)} lower than current price."
        )
    else:
        reasons.append(
            "Expected future price is almost equal to the current price."
        )

    if current_price >= msp:
        reasons.append(
            "Current market price is above or equal to MSP."
        )
    else:
        reasons.append(
            "Current market price is below MSP."
        )

    weather_risk = weather_risk.upper()

    if weather_risk == "HIGH":
        reasons.append(
            "Weather risk is high, so delaying the sale may increase crop risk."
        )
    elif weather_risk == "MEDIUM":
        reasons.append(
            "Weather conditions have moderate risk."
        )
    else:
        reasons.append(
            "Weather conditions are relatively favorable."
        )

    if transport_cost > 1000:
        reasons.append(
            "Transport cost is relatively high."
        )
    else:
        reasons.append(
            "Transport cost is manageable."
        )

    if storage_cost > 1500:
        reasons.append(
            "Storage cost is high and may reduce future profit."
        )
    elif storage_cost > 0:
        reasons.append(
            "Storage cost is acceptable for short-term holding."
        )

    if decision.upper() == "SELL":
        summary = "Selling now appears to be the safer option."

    elif decision.upper() == "HOLD":
        summary = "Waiting for a short period may offer a better opportunity."

    elif decision.upper() == "STORE":
        summary = "Storing the crop may provide a better expected return."

    else:
        summary = "The system needs more information before making a strong recommendation."

    return {
        "decision": decision.upper(),
        "summary": summary,
        "reasons": reasons
    }
