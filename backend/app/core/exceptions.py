"""Domain exceptions shared across features."""


class DomainError(Exception):
    """Base class for business-rule violations."""


class InvalidInputError(DomainError):
    """Provided input violates a business rule (HTTP 400)."""


class AuthenticationError(DomainError):
    """Credentials invalid, locked, or session expired (HTTP 401)."""


class NotFoundError(DomainError):
    """Requested resource does not exist (HTTP 404)."""


class ConflictError(DomainError):
    """Requested state conflicts with existing data (HTTP 409)."""
   
    
class RateLimitError(DomainError):
    """Too many requests within a time window (HTTP 429)."""