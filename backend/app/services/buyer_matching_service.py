import requests

def calculate_osrm_distance(origin_lat: float, origin_lng: float, dest_lat: float, dest_lng: float):
    try:
        url = f"http://router.project-osrm.org/route/v1/driving/{origin_lng},{origin_lat};{dest_lng},{dest_lat}?overview=false"
        res = requests.get(url, timeout=3)
        if res.status_code == 200:
            data = res.json()
            routes = data.get("routes", [])
            if routes:
                km = round(routes[0]["distance"] / 1000.0, 1)
                hours = round(routes[0]["duration"] / 3600.0, 1)
                return km, hours
    except Exception:
        pass
    # Fallback to Haversine straight-line if OSRM service is temporarily unreachable
    return None, None

def calculate_buyer_match_score(farmer_crop: str, farmer_variety: str, farmer_qty: float, 
                                 farmer_moisture: float, buyer: dict, distance_km: float) -> dict:
    score = 100.0
    penalties = []

    # 1. Crop Match
    if farmer_crop.lower() not in buyer["required_crop"].lower():
        return {"score": 0.0, "reasons": ["Crop does not match buyer requirement."]}

    # 2. Variety Delta
    if buyer.get("required_variety") and farmer_variety:
        if farmer_variety.lower() != buyer["required_variety"].lower():
            score -= 15.0
            penalties.append("Variety variance (-15 pts)")

    # 3. Quantity Matching
    min_q = buyer.get("min_quantity_qtl", 0.0)
    max_q = buyer.get("max_quantity_qtl", 10000.0)
    if farmer_qty < min_q:
        deficit = min_q - farmer_qty
        penalty = min(30.0, (deficit / min_q) * 30.0)
        score -= penalty
        penalties.append(f"Below buyer minimum lot size of {min_q} Qtl")
    elif max_q and farmer_qty > max_q:
        score -= 10.0
        penalties.append("Exceeds single delivery intake capacity")

    # 4. Moisture Tolerance
    max_m = buyer.get("max_moisture_pct", 14.0)
    if farmer_moisture > max_m:
        diff = farmer_moisture - max_m
        score -= min(35.0, diff * 15.0)
        penalties.append(f"Moisture ({farmer_moisture}%) exceeds limit of {max_m}%")

    # 5. Distance Penalty
    if distance_km is not None:
        if distance_km > 100.0:
            score -= min(25.0, (distance_km - 100.0) * 0.2)
            penalties.append(f"High transit distance ({distance_km} km)")

    final_score = max(0.0, min(100.0, round(score, 1)))
    return {
        "score": final_score,
        "reasons": penalties if penalties else ["Meets all buyer specifications."]
    }