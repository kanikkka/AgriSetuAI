from pydantic import BaseModel


class StorageProviderCreate(BaseModel):
    storage_name: str
    district: str
    supported_crop: str
    total_capacity_quintal: float
    available_capacity_quintal: float
    cost_per_quintal_per_day: float


class StorageProviderResponse(StorageProviderCreate):
    id: int
    user_id: int
    status: str

    model_config = {
        "from_attributes": True
    }
