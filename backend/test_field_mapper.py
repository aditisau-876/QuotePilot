from app.agent.field_mapper import map_field, classify_confidence

TEST_FIELDS = [
    "Product",
    "Required Units",
    "Shipping Destination",
    "Lead Time",
    "Warranty Period",

    # Unknown / unusual field names
    "How many pieces are required?",
    "Expected arrival timeframe",
    "Coverage duration",
    "What item are you looking for?",
    "Where should we ship the order?",
]


def main():

    print("\nINTELLIGENT FIELD MAPPER TEST")
    print("=" * 70)

    for field in TEST_FIELDS:

        print(f"\nField: {field}")

        try:

            result = map_field(field)

            print(f"Confidence: {result.confidence}")
            print(f"Decision: {classify_confidence(result.confidence)}")
            print(f"Reasoning: {result.reasoning}")

        except Exception as e:

            print(f"ERROR: {e}")


if __name__ == "__main__":
    main()