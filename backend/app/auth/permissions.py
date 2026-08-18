"""Action catalog and permission helpers for RBAC."""

from dataclasses import dataclass


@dataclass(frozen=True)
class Action:
    """A discrete permission action with metadata."""

    code: str
    label: str
    scope_aware: bool  # True if action filters by channel/platform scope
    delegable: bool  # False = owner-only


# Action catalog: the source of truth for all permissions
ACTION_CATALOG: dict[str, Action] = {
    action.code: action
    for action in [
        Action("content:view", "View content", True, True),
        Action("content:create", "Create content", True, True),
        Action("content:publish", "Publish content", True, True),
        Action("channels:view", "View channels", True, True),
        Action("channels:manage", "Manage channels", True, True),
        Action("analytics:view", "View analytics", True, True),
        Action("ai:use", "Use AI features", False, True),
        Action("exports:download", "Download exports", True, True),
        Action("members:manage", "Manage members", False, False),
        Action("billing:view", "View billing", False, False),
    ]
}


def validate_actions(actions: list[str]) -> None:
    """Raise ValueError if any action code is not in the catalog."""
    for action in actions:
        if action not in ACTION_CATALOG:
            raise ValueError(f"Unknown action: {action}")


def owner_only_actions() -> set[str]:
    """Return the set of actions that cannot be delegated."""
    return {code for code, action in ACTION_CATALOG.items() if not action.delegable}