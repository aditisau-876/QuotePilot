from app.agent.requirement_parser import parse_requirement


TEST_REQUESTS = [
    "I need 100 Dell laptops delivered to Kolkata within 7 days with at least 2 years warranty.",

    "Need 50 office chairs delivered to Kolkata within 10 days with a minimum 3-year warranty.",

    "We are looking for 200 monitors. They must arrive within 14 days and have at least a 3 year warranty.",

    "I need 500 printers with a 24 month warranty. Delivery should be within 5 days.",

    "Looking for 100 business laptops for Kolkata. Delivery should not exceed one week and warranty should be at least 2 years.",

    "We need 75 HP laptops, delivery in Mumbai, maximum delivery time 10 days, minimum warranty 36 months.",

    "I need 100 laptops as soon as possible with a 2 year warranty."
]


def main():

    for i, request in enumerate(TEST_REQUESTS, start=1):

        print("\n" + "=" * 70)
        print(f"TEST {i}")
        print("=" * 70)

        print(f"\nUser Request:\n{request}")

        try:
            result = parse_requirement(request)

            print("\nParsed Requirements:")
            print(result.model_dump_json(indent=2))

        except Exception as e:
            print(f"\nERROR: {e}")


if __name__ == "__main__":
    main()