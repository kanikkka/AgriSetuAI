from ml.src.predict import predict_price
from app.services.advanced_decision import advanced_decision
from app.services.confidence_engine import calculate_confidence_and_risk
from app.services.explanation_engine import explain_recommendation


def build_master_farmer_intelligence(
    day: int,
    month: int,
    previous_price: float,
    current_price: float,
    msp: float,
    weather_risk: str,
    quantity_quintal: float,
    storage_cost: float,
    transport_cost: float,
    data_quality_score: float = 80
):
    predicted_price = predict_price(
        day=day,
        month=month,
        previous_price=previous_price
    )

    decision = advanced_decision(
        current_price=current_price,
        predicted_price=predicted_price,
        msp=msp,
        weather_risk=weather_risk,
        quantity_quintal=quantity_quintal,
        storage_cost=storage_cost,
        transport_cost=transport_cost
    )

    prediction_gap_percent = (
        ((predicted_price - current_price) / current_price) * 100
        if current_price > 0
        else 0
    )

    confidence = calculate_confidence_and_risk(
        prediction_gap_percent=prediction_gap_percent,
        weather_risk=weather_risk,
        data_quality_score=data_quality_score,
        mandi_data_available=True,
        msp_available=True
    )

    explanation = explain_recommendation(
        decision=decision["decision"],
        current_price=current_price,
        expected_future_price=predicted_price,
        msp=msp,
        weather_risk=weather_risk,
        transport_cost=transport_cost,
        storage_cost=storage_cost
    )

    return {
        "price_prediction": {
            "current_price": current_price,
            "predicted_price": predicted_price,
            "expected_change_percent": round(prediction_gap_percent, 2)
        },
        "decision": decision,
        "confidence": confidence,
        "explanation": explanation
    }
