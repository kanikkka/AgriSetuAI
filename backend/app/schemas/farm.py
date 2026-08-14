from pydantic import BaseModel


class FarmCreate(BaseModel):
    farm_name: str
    village: str | None = None
    district: str | None = None
    land_area_acres: float
    latitude: float | None = None
    longitude: float | None = None
    soil_type: str | None = None


class FarmResponse(FarmCreate):
    id: int
    farmer_id: int

    model_config = {
        "from_attributes": True
    }
