import pandas as pd


def load_and_prepare_data(file_path):
    df = pd.read_csv(file_path)

    df["date"] = pd.to_datetime(df["date"])

    df["day"] = df["date"].dt.day
    df["month"] = df["date"].dt.month

    df = df.sort_values("date")

    df["previous_price"] = df["modal_price"].shift(1)

    df = df.dropna()

    return df
