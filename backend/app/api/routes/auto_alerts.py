from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.api.routes.auth import get_current_user
from app.services.alert_generator import (
    generate_price_alert,
    generate_weather_alert,
    generate_buyer_match_alert
)


router = APIRouter(
    prefix="/auto-alerts",
    tags=["Automatic Alerts"]
)


@router.post("/price")
def generate_price_notification(
    crop_name: str,
    current_price: float,
    target_price: float,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    alert = generate_price_alert(
        db=db,
        user_id=current_user.id,
        crop_name=crop_name,
        current_price=current_price,
        target_price=target_price
    )

    if not alert:
        return {
            "generated": False,
            "message": "Target price not reached yet"
        }

    return {
        "generated": True,
        "alert_id": alert.id
    }


@router.post("/weather")
def generate_weather_notification(
    weather_risk: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    alert = generate_weather_alert(
        db=db,
        user_id=current_user.id,
        weather_risk=weather_risk
    )

    if not alert:
        return {
            "generated": False,
            "message": "Weather risk is not high"
        }

    return {
        "generated": True,
        "alert_id": alert.id
    }


@router.post("/buyer-match")
def generate_match_notification(
    crop_name: str,
    match_score: float,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    alert = generate_buyer_match_alert(
        db=db,
        user_id=current_user.id,
        crop_name=crop_name,
        match_score=match_score
    )

    if not alert:
        return {
            "generated": False,
            "message": "Match score is below alert threshold"
        }

    return {
        "generated": True,
        "alert_id": alert.id
    }
