from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.api.routes.auth import get_current_user
from app.models.farmer_profile import FarmerProfile
from app.models.farm import Farm
from app.models.crop import Crop
from app.models.recommendation_history import RecommendationHistory
from app.services.season_replay import build_season_replay


router = APIRouter(
    prefix="/season-replay",
    tags=["Farmer Season Replay"]
)


@router.get("")
def get_season_replay(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    farmer_profile = db.query(FarmerProfile).filter(
        FarmerProfile.user_id == current_user.id
    ).first()

    if not farmer_profile:
        return {
            "timeline": []
        }

    farms = db.query(Farm).filter(
        Farm.farmer_id == farmer_profile.id
    ).all()

    farm_ids = [farm.id for farm in farms]

    crops = []

    if farm_ids:
        crops = db.query(Crop).filter(
            Crop.farm_id.in_(farm_ids)
        ).all()

    recommendations = db.query(
        RecommendationHistory
    ).filter(
        RecommendationHistory.user_id == current_user.id
    ).all()

    timeline = build_season_replay(
        crops,
        recommendations
    )

    return {
        "farmer_id": farmer_profile.id,
        "total_events": len(timeline),
        "timeline": timeline
    }
