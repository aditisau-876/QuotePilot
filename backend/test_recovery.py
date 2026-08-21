from app.agent.recovery import recover_mapping


def main():

    print("\nRECOVERY ENGINE TEST")
    print("=" * 70)

    old_field = "Required Units"

    current_fields = [
        "Product Description",
        "Number of Products",
        "Destination",
        "Expected Arrival",
        "Coverage Duration",
    ]

    print("\nOld workflow:")
    print(f"quantity → {old_field}")

    print("\nCurrent website fields:")

    for field in current_fields:
        print(f"  - {field}")

    print("\nAttempting recovery...")

    result = recover_mapping(
        concept="quantity",
        old_field=old_field,
        current_fields=current_fields,
    )

    print("\nRecovery Result:")
    print(f"Success: {result.success}")
    print(f"Concept: {result.concept}")
    print(f"Old Field: {result.old_field}")
    print(f"New Field: {result.new_field}")
    print(f"Confidence: {result.confidence}")
    print(f"Reasoning: {result.reasoning}")


if __name__ == "__main__":
    main()