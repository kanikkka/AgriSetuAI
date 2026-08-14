from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.api.routes.auth import get_current_user

from app.models.farmer_profile import FarmerProfile
from app.models.supply_intent import SupplyIntent
from app.models.buyer_demand import BuyerDemandIntent
from app.models.storage_provider import StorageProvider
from app.models.transport_provider import TransportProvider

from app.services.farmer_opportunity import build_farmer_opportunities


router = APIRouter(
    prefix="/farmer-opportunities",
    tags=["Farmer Opportunity Engine"]
)


@router.get("")
def get_farmer_opportunities(
    day: int,
    month: int,
    previous_price: float,
    current_price: float,
    msp: float,
    weather_risk: str,
    quantity_quintal: float,
    district: str,
    distance_km: float = 30,
    storage_days: int = 7,
    storage_cost: float = 0,
    transport_cost: float = 0,
    data_quality_score: float = 80,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    farmer_profile = db.query(FarmerProfile).filter(
        FarmerProfile.user_id == current_user.id
    ).first()

    supply_intent = None

    if farmer_profile:
        supply_intent = db.query(SupplyIntent).filter(
            SupplyIntent.farmer_id == farmer_profile.id,
            SupplyIntent.status == "OPEN"
        ).first()

    buyer_demands = db.query(BuyerDemandIntent).filter(
        BuyerDemandIntent.status == "OPEN"
    ).all()

    all_supplies = db.query(SupplyIntent).filter(
        SupplyIntent.status == "OPEN"
    ).all()

    storages = db.query(StorageProvider).filter(
        StorageProvider.status == "AVAILABLE"
    ).all()

    transporters = db.query(TransportProvider).filter(
        TransportProvider.status == "AVAILABLE"
    ).all()

    return build_farmer_opportunities(
        day=day,
        month=month,
        previous_price=previous_price,
        current_price=current_price,
        msp=msp,
        weather_risk=weather_risk,
        quantity_quintal=quantity_quintal,
        storage_cost=storage_cost,
        transport_cost=transport_cost,
        data_quality_score=data_quality_score,
        supply_intent=supply_intent,
        buyer_demands=buyer_demands,
        all_supplies=all_supplies,
        storages=storages,
        transporters=transporters,
        district=district,
        distance_km=distance_km,
        storage_days=storage_days
    )
