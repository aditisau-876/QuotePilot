from pydantic import BaseModel, Field
from .field_mapper import map_field
from .workflow_memory import get_workflow, save_workflow

class RecoveryResult(BaseModel):
    success: bool
    concept: str
    old_field: str
    new_field: str | None
    confidence: float = Field(ge=0.0, le=1.0)
    reasoning: str


def recover_mapping(
    concept: str,
    old_field: str,
    current_fields: list[str],
) -> RecoveryResult:

    candidates = []

    for field in current_fields:

        result = map_field(field)

        if result.concept == concept:

            candidates.append(result)

    if not candidates:

        return RecoveryResult(
            success=False,
            concept=concept,
            old_field=old_field,
            new_field=None,
            confidence=0.0,
            reasoning=(
                f"No field matching the concept '{concept}' "
                "was found on the current page."
            ),
        )

    best_match = max(
        candidates,
        key=lambda result: result.confidence,
    )

    return RecoveryResult(
        success=True,
        concept=concept,
        old_field=old_field,
        new_field=best_match.field_name,
        confidence=best_match.confidence,
        reasoning=(
            f"Recovered '{concept}' by mapping "
            f"'{best_match.field_name}' to the same concept."
        ),
    )



def recover_and_update_workflow(
    supplier_id: str,
    concept: str,
    old_field: str,
    current_fields: list[str],
) -> RecoveryResult:

    result = recover_mapping(
        concept=concept,
        old_field=old_field,
        current_fields=current_fields,
    )

    if not result.success:
        return result

    workflow = get_workflow(supplier_id)

    if not workflow:
        return RecoveryResult(
            success=False,
            concept=concept,
            old_field=old_field,
            new_field=result.new_field,
            confidence=result.confidence,
            reasoning="Recovery succeeded, but no workflow was found in memory.",
        )

    mappings = workflow["mappings"]

    mappings[concept] = result.new_field

    save_workflow(
        supplier_id=supplier_id,
        mappings=mappings,
    )

    return RecoveryResult(
        success=True,
        concept=concept,
        old_field=old_field,
        new_field=result.new_field,
        confidence=result.confidence,
        reasoning=(
            f"Recovered mapping and updated workflow memory. "
            f"'{concept}' now maps to '{result.new_field}'."
        ),
    )