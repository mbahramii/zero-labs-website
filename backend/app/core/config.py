"""Application configuration loaded from environment variables."""

from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

ENV_FILE = Path(__file__).resolve().parents[2] / ".env"


class Settings(BaseSettings):
    """Typed, validated application settings (fail-fast on missing values)."""

    model_config = SettingsConfigDict(
        env_file=ENV_FILE, env_file_encoding="utf-8", extra="ignore"
    )

    app_name: str = "Social Publish API"
    debug: bool = False
    database_url: str 
    cors_origins_raw: str = "http://localhost:3000"
    secret_key: str  # missing => fail-fast; HS256 signing key
    access_token_ttl_minutes: int = 30
    refresh_token_ttl_days: int = 30
    otp_ttl_minutes: int = 5
    otp_hourly_cap: int = 3

    @property
    def cors_origins(self) -> list[str]:
        """Split the comma-separated CORS origins string."""
        return [o.strip() for o in self.cors_origins_raw.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    """Return a process-wide cached Settings instance."""
    return Settings()