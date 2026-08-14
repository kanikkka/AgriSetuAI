from pydantic import BaseModel


class TransportProviderCreate(BaseModel):
    provider_name: str
    vehicle_type: str
    capacity_quintal: float
    district: str
    cost_per_km: float


class TransportProviderResponse(TransportProviderCreate):
    id: int
    user_id: int
    status: str

    model_config = {
        "from_attributes": True
    }
