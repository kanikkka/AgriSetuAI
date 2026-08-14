def match_transport_options(
    providers,
    quantity_quintal: float,
    district: str,
    distance_km: float
):
    matches = []

    for provider in providers:

        if provider.capacity_quintal < quantity_quintal:
            continue

        score = 0
        reasons = []

        if provider.district.lower() == district.lower():
            score += 60
            reasons.append("Same district")

        score += 40
        reasons.append("Required capacity available")

        estimated_transport_cost = (
            distance_km * provider.cost_per_km
        )

        matches.append({
            "provider_id": provider.id,
            "provider_name": provider.provider_name,
            "vehicle_type": provider.vehicle_type,
            "capacity_quintal": provider.capacity_quintal,
            "district": provider.district,
            "cost_per_km": provider.cost_per_km,
            "distance_km": distance_km,
            "estimated_transport_cost": estimated_transport_cost,
            "match_score": score,
            "reasons": reasons
        })

    matches.sort(
        key=lambda x: (
            -x["match_score"],
            x["estimated_transport_cost"]
        )
    )

    return matches
