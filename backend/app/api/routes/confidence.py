from fastapi import APIRouter

router = APIRouter(
    prefix="/confidence",
    tags=["Confidence"]
)


@router.get("")
def get_confidence():
    return {
        "confidence": 82,
        "status": "high",
        "message": "Confidence score calculated from available market signals."
    }
