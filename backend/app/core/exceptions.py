"""Domain exceptions shared across features."""


class DomainError(Exception):
    """Base class for business-rule violations."""

    code = "GENERAL_ERROR"


class InvalidInputError(DomainError):
    """Provided input violates a business rule (HTTP 400)."""

    code = "INVALID_INPUT"


class AuthenticationError(DomainError):
    """Credentials invalid, locked, or session expired (HTTP 401)."""

    code = "AUTH_INVALID"


class NotFoundError(DomainError):
    """Requested resource does not exist (HTTP 404)."""

    code = "NOT_FOUND"


class ConflictError(DomainError):
    """Requested state conflicts with existing data (HTTP 409)."""

    code = "CONFLICT"


class RateLimitError(DomainError):
    """Too many requests within a time window (HTTP 429)."""

    code = "RATE_LIMITED"


class AuthorizationError(DomainError):
    """User lacks permission for the requested action (HTTP 403)."""

    code = "FORBIDDEN"