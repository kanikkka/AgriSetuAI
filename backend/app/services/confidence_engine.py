def calculate_confidence_and_risk(
    prediction_gap_percent: float,
    weather_risk: str,
    data_quality_score: float,
    mandi_data_available: bool,
    msp_available: bool
):
    confidence_score = 50
    risk_score = 50
    reasons = []

    # Prediction stability
    if abs(prediction_gap_percent) <= 3:
        confidence_score += 15
        risk_score -= 10
        reasons.append("Price movement is relatively stable")
    elif abs(prediction_gap_percent) <= 8:
        confidence_score += 5
        reasons.append("Moderate expected price movement")
    else:
        confidence_score -= 10
        risk_score += 15
        reasons.append("High price volatility expected")

    # Weather risk
    weather_risk = weather_risk.upper()

    if weather_risk == "LOW":
        confidence_score += 10
        risk_score -= 15
        reasons.append("Low weather risk")
    elif weather_risk == "MEDIUM":
        reasons.append("Moderate weather risk")
    elif weather_risk == "HIGH":
        confidence_score -= 15
        risk_score += 20
        reasons.append("High weather risk")

    # Data quality
    if data_quality_score >= 80:
        confidence_score += 15
        risk_score -= 10
        reasons.append("Good data quality")
    elif data_quality_score >= 60:
        confidence_score += 5
        reasons.append("Acceptable data quality")
    else:
        confidence_score -= 15
        risk_score += 15
        reasons.append("Low data quality")

    # Mandi data
    if mandi_data_available:
        confidence_score += 5
    else:
        confidence_score -= 10
        risk_score += 10
        reasons.append("Mandi data unavailable")

    # MSP data
    if msp_available:
        confidence_score += 5
    else:
        confidence_score -= 5
        reasons.append("MSP data unavailable")

    confidence_score = max(0, min(100, confidence_score))
    risk_score = max(0, min(100, risk_score))

    if confidence_score >= 75:
        confidence_level = "HIGH"
    elif confidence_score >= 50:
        confidence_level = "MEDIUM"
    else:
        confidence_level = "LOW"

    if risk_score <= 35:
        risk_level = "LOW"
    elif risk_score <= 65:
        risk_level = "MEDIUM"
    else:
        risk_level = "HIGH"

    return {
        "confidence_score": confidence_score,
        "confidence_level": confidence_level,
        "risk_score": risk_score,
        "risk_level": risk_level,
        "reasons": reasons
    }
