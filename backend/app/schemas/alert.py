from pydantic import BaseModel


class AlertCreate(BaseModel):
    alert_type: str
    title: str
    message: str


class AlertResponse(BaseModel):
    id: int
    user_id: int
    alert_type: str
    title: str
    message: str
    is_read: bool

    model_config = {
        "from_attributes": True
    }
