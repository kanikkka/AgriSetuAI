def translate_response(
    language: str,
    decision: str,
    expected_price: float
):
    language = language.lower()

    if language == "hindi":
        return (
            f"AI ki salah: {decision}. "
            f"Anumanit bhav ?{expected_price} prati quintal hai."
        )

    if language == "punjabi":
        return (
            f"AI di salah: {decision}. "
            f"Anumanit bhav ?{expected_price} prati quintal hai."
        )

    return (
        f"AI recommendation: {decision}. "
        f"Expected price is ?{expected_price} per quintal."
    )
