from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.farmer_profile import FarmerProfile
from app.models.farm import Farm
from app.models.crop import Crop
from app.api.routes.auth import get_current_user


router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get("/summary")
def get_dashboard_summary(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    farmer_profile = db.query(FarmerProfile).filter(
        FarmerProfile.user_id == current_user.id
    ).first()

    if not farmer_profile:
        return {
            "total_farms": 0,
            "total_land_acres": 0,
            "total_crops": 0,
            "total_quantity_quintal": 0
        }

    farms = db.query(Farm).filter(
        Farm.farmer_id == farmer_profile.id
    ).all()

    farm_ids = [farm.id for farm in farms]

    total_land = sum(
        farm.land_area_acres for farm in farms
    )

    crops = []

    if farm_ids:
        crops = db.query(Crop).filter(
            Crop.farm_id.in_(farm_ids)
        ).all()

    total_quantity = sum(
        crop.quantity_quintal for crop in crops
    )

    return {
        "total_farms": len(farms),
        "total_land_acres": total_land,
        "total_crops": len(crops),
        "total_quantity_quintal": total_quantity
    }
