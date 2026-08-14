from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.transport_provider import TransportProvider
from app.services.transport_matching import match_transport_options


router = APIRouter(
    prefix="/transport-matching",
    tags=["Transport Matching"]
)


@router.get("")
def get_transport_matches(
    quantity_quintal: float,
    district: str,
    distance_km: float,
    db: Session = Depends(get_db)
):
    providers = db.query(TransportProvider).filter(
        TransportProvider.status == "AVAILABLE"
    ).all()

    matches = match_transport_options(
        providers=providers,
        quantity_quintal=quantity_quintal,
        district=district,
        distance_km=distance_km
    )

    return {
        "total_matches": len(matches),
        "matches": matches
    }
