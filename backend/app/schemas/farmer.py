from pydantic import BaseModel


class FarmerProfileCreate(BaseModel):
    phone: str | None = None
    village: str | None = None
    district: str | None = None
    state: str = "Punjab"
    language: str = "Punjabi"
    total_land_acres: float | None = None


class FarmerProfileResponse(FarmerProfileCreate):
    id: int
    user_id: int

    model_config = {
        "from_attributes": True
    }
