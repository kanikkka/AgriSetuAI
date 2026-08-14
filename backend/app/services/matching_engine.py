from datetime import datetime


def calculate_match_score(supply, demand):
    score = 0
    reasons = []

    if supply.crop_name.lower() == demand.crop_name.lower():
        score += 40
        reasons.append("Same crop")

    if supply.quality_grade and demand.quality_grade:
        if supply.quality_grade.lower() == demand.quality_grade.lower():
            score += 20
            reasons.append("Quality matched")

    if supply.district and demand.district:
        if supply.district.lower() == demand.district.lower():
            score += 15
            reasons.append("Same district")

    supply_date = datetime.strptime(
        supply.available_date,
        "%Y-%m-%d"
    )

    from_date = datetime.strptime(
        demand.required_from_date,
        "%Y-%m-%d"
    )

    to_date = datetime.strptime(
        demand.required_to_date,
        "%Y-%m-%d"
    )

    if from_date <= supply_date <= to_date:
        score += 15
        reasons.append("Date matched")

    if supply.quantity_quintal <= demand.quantity_quintal:
        score += 10
        reasons.append("Quantity suitable")

    return {
        "score": score,
        "reasons": reasons
    }
