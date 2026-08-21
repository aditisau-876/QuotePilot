import json
from pathlib import Path
from typing import Any


MEMORY_FILE = (
    Path(__file__).resolve().parents[2] / "data" / "workflows.json"
)


def _load_memory() -> dict[str, Any]:

    if not MEMORY_FILE.exists():
        return {}

    with open(MEMORY_FILE, "r", encoding="utf-8") as file:
        return json.load(file)


def _save_memory(memory: dict[str, Any]) -> None:

    MEMORY_FILE.parent.mkdir(parents=True, exist_ok=True)

    with open(MEMORY_FILE, "w", encoding="utf-8") as file:
        json.dump(memory, file, indent=2)


def get_workflow(supplier_id: str) -> dict[str, Any] | None:

    memory = _load_memory()

    return memory.get(supplier_id)


def save_workflow(
    supplier_id: str,
    mappings: dict[str, str],
) -> None:

    memory = _load_memory()

    existing = memory.get(supplier_id)

    version = 1

    if existing:
        version = existing.get("version", 0) + 1

    memory[supplier_id] = {
        "version": version,
        "mappings": mappings,
    }

    _save_memory(memory)


def delete_workflow(supplier_id: str) -> None:

    memory = _load_memory()

    if supplier_id in memory:
        del memory[supplier_id]

    _save_memory(memory)