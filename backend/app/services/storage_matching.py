def match_storage_options(
    storages,
    crop_name: str,
    quantity_quintal: float,
    district: str,
    storage_days: int
):
    matches = []

    for storage in storages:

        if storage.supported_crop.lower() != crop_name.lower():
            continue

        if storage.available_capacity_quintal < quantity_quintal:
            continue

        score = 0
        reasons = []

        if storage.district.lower() == district.lower():
            score += 60
            reasons.append("Same district")

        score += 20
        reasons.append("Crop supported")

        score += 20
        reasons.append("Required capacity available")

        total_storage_cost = (
            quantity_quintal
            * storage.cost_per_quintal_per_day
            * storage_days
        )

        matches.append({
            "storage_id": storage.id,
            "storage_name": storage.storage_name,
            "district": storage.district,
            "available_capacity_quintal": storage.available_capacity_quintal,
            "cost_per_quintal_per_day": storage.cost_per_quintal_per_day,
            "storage_days": storage_days,
            "estimated_total_cost": total_storage_cost,
            "match_score": score,
            "reasons": reasons
        })

    matches.sort(
        key=lambda x: x["match_score"],
        reverse=True
    )

    return matches
