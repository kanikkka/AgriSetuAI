from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.mandi_price import MandiPrice
from app.schemas.mandi_price import MandiPriceCreate, MandiPriceResponse
from app.services.mandi_fetcher import fetch_and_sync_punjab_mandi_prices

router = APIRouter(
    prefix="/mandi-prices",
    tags=["Mandi Prices"]
)

@router.post("/sync")
def sync_punjab_mandi_prices(limit: int = 100, db: Session = Depends(get_db)):
    try:
        result = fetch_and_sync_punjab_mandi_prices(db=db, limit=limit)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("", response_model=MandiPriceResponse)
def create_mandi_price(
    data: MandiPriceCreate,
    db: Session = Depends(get_db)
):
    price = MandiPrice(**data.model_dump())
    db.add(price)
    db.commit()
    db.refresh(price)
    return price

@router.get("", response_model=list[MandiPriceResponse])
def get_mandi_prices(
    db: Session = Depends(get_db)
):
    return db.query(MandiPrice).all()

@router.get("/crop/{crop_name}", response_model=list[MandiPriceResponse])
def get_prices_by_crop(
    crop_name: str,
    db: Session = Depends(get_db)
):
    return db.query(MandiPrice).filter(
        MandiPrice.crop_name == crop_name
    ).all()
