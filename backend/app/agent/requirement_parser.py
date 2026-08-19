from .gemini_client import client
from .schemas import ProcurementRequirements


MODEL_NAME = "gemini-3.6-flash"


SYSTEM_INSTRUCTION = """
You are the requirement-understanding component of an AI procurement agent.

Your job is to convert a user's natural-language procurement request
into structured procurement requirements.

Extract only information that is actually present in the user's request.

Important rules:

1. Preserve the product name accurately.
2. Extract the requested quantity as an integer.
3. Convert delivery requirements into maximum acceptable days.
4. Convert warranty requirements into years.
5. Convert months to years when necessary.
6. If a field is not provided, return null.
7. Never invent missing information.
8. Return only the requested structured information.
"""


def parse_requirement(user_request: str) -> ProcurementRequirements:

    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=user_request,
        config={
            "system_instruction": SYSTEM_INSTRUCTION,
            "response_mime_type": "application/json",
            "response_schema": ProcurementRequirements,
        },
    )

    return ProcurementRequirements.model_validate_json(response.text)