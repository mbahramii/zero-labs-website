"""SMS delivery abstraction (console sender for dev)."""

import logging
from abc import ABC, abstractmethod

logger = logging.getLogger(__name__)


class SmsSender(ABC):
    """Interface for SMS delivery providers."""

    @abstractmethod
    def send(self, phone_number: str, message: str) -> None:
        """Send an SMS message to the given phone number."""


class ConsoleSmsSender(SmsSender):
    """Dev-only sender that logs instead of sending."""

    def send(self, phone_number: str, message: str) -> None:
        """Log the SMS payload instead of sending it."""
        logger.warning("DEV SMS to %s: %s", phone_number, message)


def get_sms_sender() -> SmsSender:
    """Return the configured SMS sender (console for now)."""
    return ConsoleSmsSender()