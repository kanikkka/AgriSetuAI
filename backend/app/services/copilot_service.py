from ml.src.predict import predict_price
from app.services.decision_engine import calculate_decision
from app.services.language_service import translate_response


def handle_farmer_query(
    message: str,
    current_price: float,
    previous_price: float,
    day: int,
    month: int,
    msp: float,
    language: str = "english"
):
    expected_price = predict_price(
        day=day,
        month=month,
        previous_price=previous_price
    )

    decision = calculate_decision(
        current_price=current_price,
        msp=msp,
        expected_future_price=expected_price,
        storage_cost_per_quintal=2,
        storage_days=7
    )

    response = translate_response(
        language=language,
        decision=decision["decision"],
        expected_price=expected_price
    )

    return {
        "message": message,
        "language": language,
        "expected_price": expected_price,
        "decision": decision["decision"],
        "response": response
    }
