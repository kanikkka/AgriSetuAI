import os
import joblib

from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error

from preprocessing import load_and_prepare_data


BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))

DATA_PATH = os.path.join(
    BASE_DIR,
    "data",
    "raw",
    "mandi_prices.csv"
)

MODEL_PATH = os.path.join(
    BASE_DIR,
    "ml",
    "models",
    "price_model.pkl"
)


df = load_and_prepare_data(DATA_PATH)

features = [
    "day",
    "month",
    "previous_price"
]

X = df[features]
y = df["modal_price"]

split_index = int(len(df) * 0.8)

X_train = X.iloc[:split_index]
X_test = X.iloc[split_index:]

y_train = y.iloc[:split_index]
y_test = y.iloc[split_index:]


model = RandomForestRegressor(
    n_estimators=100,
    random_state=42
)

model.fit(X_train, y_train)

predictions = model.predict(X_test)

mae = mean_absolute_error(
    y_test,
    predictions
)

print("Model Training Completed")
print("MAE:", mae)

joblib.dump(
    model,
    MODEL_PATH
)

print("Model saved at:")
print(MODEL_PATH)
