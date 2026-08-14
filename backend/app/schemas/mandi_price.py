from pydantic import BaseModel


class MandiPriceCreate(BaseModel):
    mandi_name: str
    district: str
    crop_name: str
    min_price: float
    max_price: float
    modal_price: float
    price_date: str


class MandiPriceResponse(MandiPriceCreate):
    id: int

    model_config = {
        "from_attributes": True
    }
