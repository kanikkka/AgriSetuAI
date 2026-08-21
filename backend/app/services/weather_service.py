import requests

def get_hyperlocal_weather(lat: float = 30.7072, lng: float = 76.2167):
    """
    Fetches real-time temperature, relative humidity, and precipitation probability
    from Open-Meteo Free Public Weather API (No API key required).
    """
    try:
        url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lng}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code&hourly=precipitation_probability&forecast_days=3"
        r = requests.get(url, timeout=3)
        if r.status_code == 200:
            data = r.json()
            curr = data.get("current", {})
            hourly = data.get("hourly", {})
            rain_probs = hourly.get("precipitation_probability", [0])
            max_rain_3d = max(rain_probs[:72]) if rain_probs else 0

            temp = curr.get("temperature_2m", 31.5)
            humidity = curr.get("relative_humidity_2m", 62)
            rain_mm = curr.get("precipitation", 0.0)

            # Quality dockage risk assessment
            risk_level = "High Moisture Risk" if humidity > 75 or max_rain_3d > 50 else "Safe Harvest Window"

            return {
                "status": "live",
                "temperature_c": temp,
                "relative_humidity_pct": humidity,
                "current_precipitation_mm": rain_mm,
                "max_rain_probability_3d_pct": max_rain_3d,
                "moisture_risk_level": risk_level,
                "source": "Open-Meteo Hyperlocal Live Feed"
            }
    except Exception as e:
        print("Weather API fallback:", e)

    return {
        "status": "fallback",
        "temperature_c": 32.0,
        "relative_humidity_pct": 60,
        "current_precipitation_mm": 0.0,
        "max_rain_probability_3d_pct": 10,
        "moisture_risk_level": "Safe Harvest Window",
        "source": "Historical Normal Benchmark"
    }