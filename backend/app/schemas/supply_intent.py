from pydantic import BaseModel


class SupplyIntentCreate(BaseModel):
    crop_name: str
    quantity_quintal: float
    available_date: str
    village: str | None = None
    district: str | None = None
    quality_grade: str | None = None


class SupplyIntentResponse(SupplyIntentCreate):
    id: int
    farmer_id: int
    status: str

    model_config = {
        "from_attributes": True
    }
