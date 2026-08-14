from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.recommendation_history import RecommendationHistory
from app.schemas.recommendation_history import (
    RecommendationCreate,
    RecommendationUpdate,
    RecommendationResponse
)
from app.api.routes.auth import get_current_user


router = APIRouter(
    prefix="/recommendations",
    tags=["Recommendation History"]
)


@router.post("", response_model=RecommendationResponse)
def save_recommendation(
    data: RecommendationCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    record = RecommendationHistory(
        user_id=current_user.id,
        crop_name=data.crop_name,
        recommendation=data.recommendation,
        predicted_price=data.predicted_price,
        result_status="PENDING"
    )

    db.add(record)
    db.commit()
    db.refresh(record)

    return record


@router.get("", response_model=list[RecommendationResponse])
def get_my_recommendations(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return db.query(RecommendationHistory).filter(
        RecommendationHistory.user_id == current_user.id
    ).all()


@router.put("/{recommendation_id}", response_model=RecommendationResponse)
def update_recommendation_result(
    recommendation_id: int,
    data: RecommendationUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    record = db.query(RecommendationHistory).filter(
        RecommendationHistory.id == recommendation_id,
        RecommendationHistory.user_id == current_user.id
    ).first()

    if not record:
        raise HTTPException(
            status_code=404,
            detail="Recommendation not found"
        )

    record.actual_action = data.actual_action
    record.actual_price = data.actual_price

    if record.predicted_price is not None:
        difference = data.actual_price - record.predicted_price

        if abs(difference) <= 50:
            record.result_status = "ACCURATE"
        elif difference > 50:
            record.result_status = "UNDER_ESTIMATED"
        else:
            record.result_status = "OVER_ESTIMATED"

    db.commit()
    db.refresh(record)

    return record
