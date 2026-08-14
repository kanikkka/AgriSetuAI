from fastapi import APIRouter

from ml.src.predict import predict_price


router = APIRouter(
    prefix="/prediction",
    tags=["Price Prediction"]
)


@router.get("/crop-price")
def get_crop_price_prediction(
    day: int,
    month: int,
    previous_price: float
):
    predicted_price = predict_price(
        day=day,
        month=month,
        previous_price=previous_price
    )

    return {
        "predicted_price_per_quintal": predicted_price,
        "input": {
            "day": day,
            "month": month,
            "previous_price": previous_price
        }
    }
