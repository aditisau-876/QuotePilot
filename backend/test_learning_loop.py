from app.agent.workflow_memory import (
    get_workflow,
    save_workflow,
)

from app.agent.recovery import recover_and_update_workflow


def main():

    supplier_id = "supplier_demo"

    # --------------------------------------------------
    # STEP 1 — Initial learning
    # --------------------------------------------------

    print("\n" + "=" * 70)
    print("STEP 1 — INITIAL LEARNING")
    print("=" * 70)

    initial_mappings = {
        "product": "Item Name",
        "quantity": "Required Units",
        "delivery_location": "Shipping Destination",
        "delivery": "Lead Time",
        "warranty": "Warranty Period",
    }

    save_workflow(
        supplier_id,
        initial_mappings,
    )

    print("\nLearned workflow:")

    print(get_workflow(supplier_id))

    # --------------------------------------------------
    # STEP 2 — Website changes
    # --------------------------------------------------

    print("\n" + "=" * 70)
    print("STEP 2 — WEBSITE CHANGED")
    print("=" * 70)

    current_fields = [
        "Product Description",
        "How many pieces are needed?",
        "Destination",
        "Expected Arrival",
        "Coverage Duration",
    ]

    print("\nNew website fields:")

    for field in current_fields:
        print(f"  - {field}")

    # --------------------------------------------------
    # STEP 3 — Recovery
    # --------------------------------------------------

    print("\n" + "=" * 70)
    print("STEP 3 — RECOVERY")
    print("=" * 70)

    result = recover_and_update_workflow(
        supplier_id=supplier_id,
        concept="quantity",
        old_field="Required Units",
        current_fields=current_fields,
    )

    print("\nRecovery result:")
    print(f"Success: {result.success}")
    print(f"Old field: {result.old_field}")
    print(f"New field: {result.new_field}")
    print(f"Confidence: {result.confidence}")
    print(f"Reasoning: {result.reasoning}")

    # --------------------------------------------------
    # STEP 4 — Updated memory
    # --------------------------------------------------

    print("\n" + "=" * 70)
    print("STEP 4 — UPDATED MEMORY")
    print("=" * 70)

    print(get_workflow(supplier_id))


if __name__ == "__main__":
    main()