"""IP-based country detection for currency selection."""

import httpx
from fastapi import Request

from app.core.config import get_settings

GEO_API_URL = "http://ip-api.com/json/{ip}?fields=countryCode,status"
CACHE_TTL_SECONDS = 86400  # 24 hours


async def detect_country_from_ip(request: Request) -> str | None:
    """Detect the client's ISO country code from their IP address.
      
    Uses ip-api.com (free tier) with Redis caching.
    Supports an override header 'X-Client-Country' for testing."""
    # Testing override (only in debug/dev)
    if get_settings().debug:
        override = request.headers.get("X-Client-Country")
        if override:
            return override.upper()

    client_ip = request.client.host if request.client else "127.0.0.1"
    
    # Handle reverse proxies
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        client_ip = forwarded.split(",")[0].strip()

    # Check Redis cache
    from app.core.database import get_redis
    redis = await get_redis()
    if redis:
        cache_key = f"geo:{client_ip}"
        cached = await redis.get(cache_key)
        if cached:
            return cached.decode("utf-8") if isinstance(cached, bytes) else cached

    # Call ip-api.com
    try:
        async with httpx.AsyncClient(timeout=3.0) as client:
            resp = await client.get(GEO_API_URL.format(ip=client_ip))
            if resp.status_code == 200:
                data = resp.json()
                if data.get("status") == "success":
                    country = data.get("countryCode")
                    # Cache the result
                    if redis and country:
                        await redis.set(cache_key, country, ex=CACHE_TTL_SECONDS)
                    return country
    except Exception:
        pass  # Fail silently, return None

    return None


def country_to_currency(country: str | None) -> str:
    """Map an ISO country code to the appropriate currency."""
    if country == "IR":
        return "IRR"
    return "USD"


async def get_client_currency(request: Request) -> str:
    """Determine the currency to use for pricing."""
    # Try to get the authenticated user's preference
    try:
        from app.auth.dependencies import get_current_team
        from app.core.database import get_db_session
        
        # Note: this is a simplified version. In production,
        # you'd properly inject dependencies.
        team = await get_current_team(request=request)
        if team and team.owner and team.owner.default_currency:
            return team.owner.default_currency
    except Exception:
        pass  # Not authenticated or no preference

    # Fall back to IP-based detection
    country = await detect_country_from_ip(request)
    return country_to_currency(country)