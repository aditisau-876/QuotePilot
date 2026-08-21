from enum import Enum


class AgentState(str, Enum):
    IDLE = "idle"
    UNDERSTANDING = "understanding"
    CHECKING_MEMORY = "checking_memory"
    LEARNING = "learning"
    REUSING = "reusing"
    RECOVERING = "recovering"
    COMPLETED = "completed"
    FAILED = "failed"