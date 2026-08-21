from app.agent.workflow_memory import (
    get_workflow,
    save_workflow,
    delete_workflow,
)


def main():

    supplier_id = "supplier_b"

    print("\n1. Checking memory before learning")
    print("-" * 50)

    workflow = get_workflow(supplier_id)

    print("Workflow:", workflow)

    print("\n2. Learning supplier workflow")
    print("-" * 50)

    mappings = {
        "product": "Item Name",
        "quantity": "Required Units",
        "delivery_location": "Shipping Destination",
        "delivery": "Lead Time",
        "warranty": "Warranty Period",
    }

    save_workflow(supplier_id, mappings)

    print("Workflow saved.")

    print("\n3. Reading workflow from memory")
    print("-" * 50)

    workflow = get_workflow(supplier_id)

    print(workflow)

    print("\n4. Updating workflow")
    print("-" * 50)

    updated_mappings = {
        "product": "Product Description",
        "quantity": "Number of Products",
        "delivery_location": "Destination",
        "delivery": "Expected Arrival",
        "warranty": "Coverage Duration",
    }

    save_workflow(supplier_id, updated_mappings)

    workflow = get_workflow(supplier_id)

    print(workflow)

    print("\n5. Deleting workflow")
    print("-" * 50)

    delete_workflow(supplier_id)

    workflow = get_workflow(supplier_id)

    print("After deletion:", workflow)


if __name__ == "__main__":
    main()