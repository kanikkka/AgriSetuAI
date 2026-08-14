import httpx

BASE_URL = "https://api.open-meteo.com/v1/forecast"


async def get_weather_data(latitude: float, longitude: float):
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "current": [
            "temperature_2m",
            "relative_humidity_2m",
            "precipitation",
            "wind_speed_10m"
        ],
        "daily": [
            "temperature_2m_max",
            "temperature_2m_min",
            "precipitation_sum"
        ],
        "timezone": "auto",
        "forecast_days": 7
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(
            BASE_URL,
            params=params,
            timeout=10.0
        )

        response.raise_for_status()

        return response.json()
