from pydantic import BaseModel


class RecommendationCreate(BaseModel):
    crop_name: str
    recommendation: str
    predicted_price: float | None = None


class RecommendationUpdate(BaseModel):
    actual_action: str
    actual_price: float


class RecommendationResponse(BaseModel):
    id: int
    user_id: int
    crop_name: str
    recommendation: str
    predicted_price: float | None
    actual_action: str | None
    actual_price: float | None
    result_status: str

    model_config = {
        "from_attributes": True
    }
