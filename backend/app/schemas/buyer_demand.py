from pydantic import BaseModel


class BuyerDemandCreate(BaseModel):
    crop_name: str
    quantity_quintal: float
    required_from_date: str
    required_to_date: str
    district: str | None = None
    quality_grade: str | None = None
    max_price_per_quintal: float | None = None


class BuyerDemandResponse(BuyerDemandCreate):
    id: int
    buyer_user_id: int
    status: str

    model_config = {
        "from_attributes": True
    }
