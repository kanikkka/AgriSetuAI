def calculate_policy_signal(
    current_price: float,
    msp: float
):
    difference = current_price - msp

    difference_percent = (
        difference / msp * 100
        if msp > 0
        else 0
    )

    if difference_percent >= 5:
        signal = "STRONG_MARKET"
        impact_score = 20
        message = "Market price is significantly above MSP."

    elif difference_percent >= 0:
        signal = "ABOVE_MSP"
        impact_score = 10
        message = "Market price is above MSP."

    elif difference_percent >= -5:
        signal = "NEAR_MSP"
        impact_score = 0
        message = "Market price is close to MSP."

    else:
        signal = "BELOW_MSP"
        impact_score = -20
        message = "Market price is significantly below MSP."

    return {
        "msp": msp,
        "current_price": current_price,
        "difference": round(difference, 2),
        "difference_percent": round(difference_percent, 2),
        "signal": signal,
        "impact_score": impact_score,
        "message": message
    }
