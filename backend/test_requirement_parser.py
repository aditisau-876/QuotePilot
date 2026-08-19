from app.agent.requirement_parser import parse_requirement


def main():

    user_request = (
        "I need 100 Dell laptops delivered to Kolkata "
        "within 7 days with at least 2 years warranty."
    )

    result = parse_requirement(user_request)

    print("\nParsed Requirements:")
    print(result.model_dump_json(indent=2))


if __name__ == "__main__":
    main()