from pydantic import BaseModel


class CropCreate(BaseModel):
    farm_id: int
    crop_name: str
    quantity_quintal: float
    expected_harvest_date: str | None = None
    crop_status: str = "Growing"
    storage_available: str = "No"


class CropResponse(CropCreate):
    id: int

    model_config = {
        "from_attributes": True
    }
