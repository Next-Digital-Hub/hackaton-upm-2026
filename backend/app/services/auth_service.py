"""
auth_service.py
Handles registration + JWT auth with the external EC2 API.

API contract (discovered via live testing):
  POST /register  → 303 with location=/?error=... if exists  (treat as OK)
                  → 303 with no error param on success       (treat as OK)
  POST /login     → 303 with location=/?token=<JWT>          (extract token from Location header)

Do NOT follow redirects — the token/error is in the Location header, not the body.
"""
import asyncio
import logging
import os
from urllib.parse import parse_qs, urlparse
from typing import Optional

import httpx

logger = logging.getLogger(__name__)

API_BASE_URL = os.getenv("API_BASE_URL", "http://ec2-54-171-51-31.eu-west-1.compute.amazonaws.com")
API_NICK = os.getenv("API_NICK", "weatherself_bot")
API_TEAM = os.getenv("API_TEAM", "WeatherSelf")
API_PASSWORD = os.getenv("API_PASSWORD", "Hackaton2024!")

_token: Optional[str] = None
_token_lock = asyncio.Lock()

# Never follow redirects — the useful data IS the redirect
_CLIENT_DEFAULTS = dict(timeout=30.0, follow_redirects=False)


async def register_account() -> bool:
    """
    POST /register  — form fields: nickName, teamName, password.
    Server returns 303 in all cases:
      - Success:          location=/?success=...  (or any non-error redirect)
      - Already exists:   location=/?error=El%20nickname%20ya%20existe
    Both 303 variants mean we can proceed — return True either way.
    """
    async with httpx.AsyncClient(**_CLIENT_DEFAULTS) as client:
        try:
            resp = await client.post(
                f"{API_BASE_URL}/register",
                data={
                    "nickName": API_NICK,
                    "teamName": API_TEAM,
                    "password": API_PASSWORD,
                },
            )
            if resp.status_code in (200, 201):
                logger.info("✅ Registered on external API (200)")
                return True
            elif resp.status_code in (303, 302, 301):
                location = resp.headers.get("location", "")
                if "error" in location.lower():
                    # "nickname already exists" — perfectly fine for us
                    logger.info("ℹ️  Account already exists on external API (303+error) — OK")
                else:
                    logger.info(f"✅ Registered on external API (303, location={location})")
                return True
            elif resp.status_code == 409:
                logger.info("ℹ️  Account already exists (409) — OK")
                return True
            else:
                logger.error(f"Registration failed {resp.status_code}: {resp.text[:200]}")
                return False
        except Exception as exc:
            logger.error(f"Registration exception: {exc}")
            return False


async def _do_login() -> Optional[str]:
    """
    POST /login  — form fields: nickName, password.
    Server returns 303 with location=/?token=<JWT> on success.
    Extract token from the Location header query string.
    """
    async with httpx.AsyncClient(**_CLIENT_DEFAULTS) as client:
        try:
            resp = await client.post(
                f"{API_BASE_URL}/login",
                data={
                    "nickName": API_NICK,
                    "password": API_PASSWORD,
                },
            )

            # Primary path: 303 with token in Location header
            if resp.status_code in (301, 302, 303):
                location = resp.headers.get("location", "")
                parsed = urlparse(location)
                params = parse_qs(parsed.query)
                token = (params.get("token") or params.get("access_token") or [None])[0]
                if token:
                    logger.info("✅ Logged in to external API, token extracted from Location header")
                    return token
                else:
                    logger.error(f"Login 303 but no token in Location: {location}")
                    return None

            # Fallback: 200 with JSON body
            if resp.status_code == 200:
                try:
                    body = resp.json()
                except Exception:
                    body = {}
                token = (
                    body.get("access_token")
                    or body.get("token")
                    or body.get("Bearer")
                    or body.get("bearer")
                    or body.get("jwt")
                    or (body.get("data") or {}).get("token")
                )
                if token:
                    logger.info("✅ Logged in to external API, token from JSON body")
                    return str(token)
                logger.error(f"Login 200 but no token found in: {list(body.keys())}")
                return None

            logger.error(f"Login failed {resp.status_code}: {resp.text[:200]}")
            return None

        except Exception as exc:
            logger.error(f"Login exception: {exc}")
            return None


async def get_token() -> Optional[str]:
    """Returns cached token, logs in if not yet acquired."""
    global _token
    async with _token_lock:
        if _token is None:
            _token = await _do_login()
        return _token


async def refresh_token() -> Optional[str]:
    """Force re-login and update cached token."""
    global _token
    async with _token_lock:
        logger.info("Refreshing external API token...")
        _token = await _do_login()
        return _token


async def get_auth_headers() -> dict:
    """Returns {'Authorization': 'Bearer <token>'} or {} if unauthenticated."""
    token = await get_token()
    return {"Authorization": f"Bearer {token}"} if token else {}


async def startup_auth():
    """Called once at FastAPI startup."""
    logger.info("🚀 Starting external API authentication sequence...")
    await register_account()
    token = await _do_login()
    global _token
    _token = token
    if token:
        logger.info(f"🔑 External API authentication complete (token: {token[:20]}...)")
    else:
        logger.warning("⚠️  External API authentication failed — will retry on first request")
