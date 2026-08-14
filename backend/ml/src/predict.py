import os
import joblib
import pandas as pd


BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))

MODEL_PATH = os.path.join(
    BASE_DIR,
    "ml",
    "models",
    "price_model.pkl"
)

model = joblib.load(MODEL_PATH)


def predict_price(day: int, month: int, previous_price: float):
    input_data = pd.DataFrame(
        [{
            "day": day,
            "month": month,
            "previous_price": previous_price
        }]
    )

    prediction = model.predict(input_data)[0]

    return round(float(prediction), 2)
