from typing import Optional

from .gemini_client import client
from .schemas import FieldMappingResult


FIELD_ALIASES = {
    "product": {
        "product",
        "product name",
        "item",
        "item name",
        "product description",
        "item description",
    },

    "quantity": {
        "quantity",
        "required quantity",
        "required units",
        "units required",
        "number of products",
        "number of units",
        "units",
    },

    "delivery_location": {
        "delivery location",
        "shipping location",
        "shipping destination",
        "destination",
        "delivery address",
        "ship to",
    },

    "delivery": {
        "delivery",
        "delivery time",
        "delivery period",
        "lead time",
        "expected delivery",
        "expected arrival",
        "shipping time",
    },

    "warranty": {
        "warranty",
        "warranty period",
        "warranty coverage",
        "guarantee",
        "guarantee period",
    },
}


SUPPORTED_CONCEPTS = [
    "product",
    "quantity",
    "delivery_location",
    "delivery",
    "warranty",
]

AUTO_ACCEPT_THRESHOLD = 0.85
REVIEW_THRESHOLD = 0.65

def normalize_field_name(field_name: str) -> str:
    """
    Normalize a website field name so that
    small differences in capitalization and spacing
    don't affect matching.
    """

    return " ".join(field_name.lower().strip().split())


def match_known_alias(field_name: str) -> Optional[str]:
    """
    Try to map a website field to one of our
    standard procurement concepts using
    deterministic aliases.
    """

    normalized = normalize_field_name(field_name)

    for concept, aliases in FIELD_ALIASES.items():

        if normalized in aliases:
            return concept

    return None



def map_unknown_field(field_name: str) -> FieldMappingResult:

    concepts = ", ".join(SUPPORTED_CONCEPTS)

    prompt = f"""
You are a semantic field mapping component for an AI procurement agent.

A supplier website contains a field with this label:

"{field_name}"

Determine which procurement concept this field represents.

Possible concepts:

{concepts}

Rules:

1. Choose only one concept from the list, or null if none apply.
2. Never invent a new concept.
3. Confidence must be between 0 and 1.
4. If the meaning is unclear, use a lower confidence.
5. Explain briefly why you selected the concept.
"""

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt,
        config={
            "response_mime_type": "application/json",
            "response_schema": FieldMappingResult,
        },
    )

    result = FieldMappingResult.model_validate_json(response.text)

    return result



def map_field(field_name: str) -> FieldMappingResult:

    known_concept = match_known_alias(field_name)

    if known_concept:

        return FieldMappingResult(
            field_name=field_name,
            concept=known_concept,
            confidence=1.0,
            reasoning="Matched using a known field alias.",
        )

    result = map_unknown_field(field_name)

    return result

def classify_confidence(confidence: float) -> str:

    if confidence >= AUTO_ACCEPT_THRESHOLD:
        return "auto_accept"

    if confidence >= REVIEW_THRESHOLD:
        return "needs_review"

    return "unsafe"