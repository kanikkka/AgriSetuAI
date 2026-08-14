from app.models.alert import Alert


def create_system_alert(
    db,
    user_id: int,
    alert_type: str,
    title: str,
    message: str
):
    alert = Alert(
        user_id=user_id,
        alert_type=alert_type,
        title=title,
        message=message,
        is_read=False
    )

    db.add(alert)
    db.commit()
    db.refresh(alert)

    return alert


def generate_price_alert(
    db,
    user_id: int,
    crop_name: str,
    current_price: float,
    target_price: float
):
    if current_price >= target_price:
        return create_system_alert(
            db=db,
            user_id=user_id,
            alert_type="PRICE",
            title=f"{crop_name} Price Opportunity",
            message=(
                f"Current price ?{current_price} has reached "
                f"your target of ?{target_price}."
            )
        )

    return None


def generate_weather_alert(
    db,
    user_id: int,
    weather_risk: str
):
    if weather_risk.upper() == "HIGH":
        return create_system_alert(
            db=db,
            user_id=user_id,
            alert_type="WEATHER",
            title="High Weather Risk",
            message=(
                "High weather risk detected. "
                "Review your crop selling or storage decision."
            )
        )

    return None


def generate_buyer_match_alert(
    db,
    user_id: int,
    crop_name: str,
    match_score: float
):
    if match_score >= 80:
        return create_system_alert(
            db=db,
            user_id=user_id,
            alert_type="BUYER_MATCH",
            title="Strong Buyer Match Found",
            message=(
                f"A strong buyer match was found for {crop_name} "
                f"with a match score of {match_score}%."
            )
        )

    return None
