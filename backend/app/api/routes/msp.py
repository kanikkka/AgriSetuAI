from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.msp import MSPPrice
from app.models.mandi_price import MandiPrice


router = APIRouter(
    prefix="/msp",
    tags=["MSP Intelligence"]
)


@router.post("/seed")
def seed_msp(db: Session = Depends(get_db)):

    data = [
        {
            "crop_name": "Wheat",
            "season": "Rabi",
            "marketing_year": "2026-27",
            "msp_per_quintal": 2585
        },
        {
            "crop_name": "Paddy Common",
            "season": "Kharif",
            "marketing_year": "2026-27",
            "msp_per_quintal": 2441
        },
        {
            "crop_name": "Paddy Grade A",
            "season": "Kharif",
            "marketing_year": "2026-27",
            "msp_per_quintal": 2461
        },
        {
            "crop_name": "Maize",
            "season": "Kharif",
            "marketing_year": "2026-27",
            "msp_per_quintal": 2410
        }
    ]

    added = 0

    for item in data:
        existing = db.query(MSPPrice).filter(
            MSPPrice.crop_name == item["crop_name"]
        ).first()

        if not existing:
            db.add(MSPPrice(**item))
            added += 1

    db.commit()

    return {
        "message": "MSP data seeded",
        "added": added
    }


@router.get("")
def get_all_msp(db: Session = Depends(get_db)):
    return db.query(MSPPrice).all()


@router.get("/compare/{crop_name}")
def compare_with_market(
    crop_name: str,
    db: Session = Depends(get_db)
):
    msp = db.query(MSPPrice).filter(
        MSPPrice.crop_name == crop_name
    ).first()

    if not msp:
        return {
            "error": "MSP not found"
        }

    latest_price = db.query(MandiPrice).filter(
        MandiPrice.crop_name == crop_name
    ).order_by(
        MandiPrice.id.desc()
    ).first()

    if not latest_price:
        return {
            "crop": crop_name,
            "msp": msp.msp_per_quintal,
            "message": "No mandi price available"
        }

    difference = latest_price.modal_price - msp.msp_per_quintal

    if difference > 0:
        status = "Above MSP"
    elif difference < 0:
        status = "Below MSP"
    else:
        status = "Equal to MSP"

    return {
        "crop": crop_name,
        "msp": msp.msp_per_quintal,
        "mandi": latest_price.mandi_name,
        "market_price": latest_price.modal_price,
        "difference": difference,
        "status": status
    }
