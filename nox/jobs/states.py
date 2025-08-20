"""
Job State Management

Defines the possible states for jobs in the NOX system and provides utilities
for validating state transitions.
"""

from enum import Enum
from typing import Set


class JobState(str, Enum):
    """Enumeration of possible job states"""

    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"


# Valid state transitions
VALID_TRANSITIONS = {
    JobState.PENDING: {JobState.RUNNING, JobState.FAILED},
    JobState.RUNNING: {JobState.COMPLETED, JobState.FAILED},
    JobState.COMPLETED: set(),  # Terminal state
    JobState.FAILED: set(),  # Terminal state
}


def is_valid_transition(from_state: JobState, to_state: JobState) -> bool:
    """Check if a state transition is valid"""
    return to_state in VALID_TRANSITIONS.get(from_state, set())


def is_terminal_state(state: JobState) -> bool:
    """Check if a state is terminal (no further transitions)"""
    return len(VALID_TRANSITIONS.get(state, set())) == 0


def get_valid_next_states(current_state: JobState) -> Set[JobState]:
    """Get all valid next states from current state"""
    return VALID_TRANSITIONS.get(current_state, set())
