def compare_selling_options(
    quantity_quintal: float,
    mandi_price: float,
    mandi_transport_cost: float,
    buyer_price: float | None = None,
    buyer_transport_cost: float = 0,
    coalition_price: float | None = None,
    coalition_cost: float = 0,
    future_price: float | None = None,
    storage_cost: float = 0
):
    options = []

    mandi_net = (
        mandi_price * quantity_quintal
        - mandi_transport_cost
    )

    options.append({
        "option": "MANDI",
        "gross_revenue": mandi_price * quantity_quintal,
        "total_cost": mandi_transport_cost,
        "net_return": mandi_net
    })

    if buyer_price is not None:
        buyer_net = (
            buyer_price * quantity_quintal
            - buyer_transport_cost
        )

        options.append({
            "option": "DIRECT_BUYER",
            "gross_revenue": buyer_price * quantity_quintal,
            "total_cost": buyer_transport_cost,
            "net_return": buyer_net
        })

    if coalition_price is not None:
        coalition_net = (
            coalition_price * quantity_quintal
            - coalition_cost
        )

        options.append({
            "option": "FARMER_COALITION",
            "gross_revenue": coalition_price * quantity_quintal,
            "total_cost": coalition_cost,
            "net_return": coalition_net
        })

    if future_price is not None:
        storage_net = (
            future_price * quantity_quintal
            - storage_cost
        )

        options.append({
            "option": "STORE_AND_SELL_LATER",
            "gross_revenue": future_price * quantity_quintal,
            "total_cost": storage_cost,
            "net_return": storage_net
        })

    options.sort(
        key=lambda x: x["net_return"],
        reverse=True
    )

    best_option = options[0]

    return {
        "best_option": best_option,
        "all_options": options
    }
