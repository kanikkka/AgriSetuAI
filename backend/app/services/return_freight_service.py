from app.services.buyer_matching_service import calculate_osrm_distance

def find_compatible_return_load(farmer_origin_lat: float, farmer_origin_lng: float,
                                destination_lat: float, destination_lng: float,
                                available_return_loads: list, live_diesel_price: float = 87.80) -> list:
    """
    Matches empty return journeys along the same highway corridor.
    """
    matches = []
    for load in available_return_loads:
        # Check reverse corridor: Load Origin close to Farmer Destination, and Load Dest close to Farmer Origin
        d1, _ = calculate_osrm_distance(destination_lat, destination_lng, load.origin_lat, load.origin_lng)
        d2, _ = calculate_osrm_distance(farmer_origin_lat, farmer_origin_lng, load.destination_lat, load.destination_lng)

        # Proximity threshold for deadhead miles
        leg1 = d1 if d1 is not None else 10.0
        leg2 = d2 if d2 is not None else 10.0

        if leg1 <= 25.0 and leg2 <= 25.0:
            total_km, hours = calculate_osrm_distance(load.origin_lat, load.origin_lng, load.destination_lat, load.destination_lng)
            road_km = total_km if total_km is not None else 45.0

            # Potential freight saving calculation
            standard_empty_loss = round((road_km * 2 / 4.5) * live_diesel_price, 1)
            shared_saving = round(standard_empty_loss * 0.45, 1)

            matches.append({
                "load_id": load.id,
                "transporter": load.transporter_name,
                "transporter_phone": load.transporter_phone,
                "vehicle_type": load.vehicle_type,
                "vehicle_number": load.vehicle_number,
                "current_route": f"{load.destination_city} → {load.origin_city}",
                "return_route": f"{load.origin_city} → {load.destination_city}",
                "available_capacity_qtl": load.available_capacity_qtl,
                "return_cargo": load.return_cargo_type,
                "distance_km": road_km,
                "drive_time": f"{hours} hrs" if hours else "1.2 hrs",
                "potential_freight_saving": shared_saving
            })
    return matches