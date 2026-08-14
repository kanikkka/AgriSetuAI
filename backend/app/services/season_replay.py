def build_season_replay(
    crops,
    recommendations
):
    timeline = []

    for crop in crops:
        timeline.append({
            "type": "CROP",
            "title": f"{crop.crop_name} added",
            "details": {
                "quantity_quintal": crop.quantity_quintal,
                "expected_harvest_date": crop.expected_harvest_date,
                "status": crop.crop_status
            }
        })

    for record in recommendations:
        timeline.append({
            "type": "RECOMMENDATION",
            "title": f"AI recommended {record.recommendation}",
            "details": {
                "crop": record.crop_name,
                "predicted_price": record.predicted_price,
                "actual_action": record.actual_action,
                "actual_price": record.actual_price,
                "result_status": record.result_status
            }
        })

    return timeline
