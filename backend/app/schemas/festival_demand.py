from pydantic import BaseModel


class FestivalDemandCreate(BaseModel):
    festival_name: str
    crop_name: str
    festival_date: str
    expected_demand_change_percent: float


class FestivalDemandResponse(FestivalDemandCreate):
    id: int

    model_config = {
        "from_attributes": True
    }
