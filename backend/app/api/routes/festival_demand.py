from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.festival_demand import FestivalDemand
from app.schemas.festival_demand import (
    FestivalDemandCreate,
    FestivalDemandResponse
)
from app.services.festival_service import analyze_festival_demand


router = APIRouter(
    prefix="/festival-demand",
    tags=["Festival Demand Intelligence"]
)


@router.post("", response_model=FestivalDemandResponse)
def create_festival_demand(
    data: FestivalDemandCreate,
    db: Session = Depends(get_db)
):
    record = FestivalDemand(
        festival_name=data.festival_name,
        crop_name=data.crop_name,
        festival_date=data.festival_date,
        expected_demand_change_percent=data.expected_demand_change_percent
    )

    db.add(record)
    db.commit()
    db.refresh(record)

    return record


@router.get("/analyze/{crop_name}")
def analyze_crop_festival_demand(
    crop_name: str,
    current_date: str,
    db: Session = Depends(get_db)
):
    festivals = db.query(FestivalDemand).filter(
        FestivalDemand.crop_name == crop_name
    ).all()

    return {
        "crop": crop_name,
        "festival_signals": [
            analyze_festival_demand(
                festival,
                current_date
            )
            for festival in festivals
        ]
    }
