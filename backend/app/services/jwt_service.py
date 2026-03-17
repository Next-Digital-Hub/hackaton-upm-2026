"""
jwt_service.py
Application-level JWT for WeatherSelf users.

⚠️  SECURITY NOTE: This is ENTIRELY SEPARATE from the EC2 external API token.
    • EC2 token  → shared team credential, lives ONLY in auth_service.py, never sent to frontend.
    • App JWT    → per-user identity token, issued here, sent to frontend as Bearer.

Functions:
    create_access_token(user_id, username) → signed JWT (8h expiry)
    verify_token(token)                    → payload dict or raises HTTP 401
"""
import os
from datetime import datetime, timedelta

from fastapi import HTTPException, status
from jose import JWTError, jwt

_SECRET = os.getenv("JWT_SECRET", "weatherself-change-this-in-production-please")
_ALGORITHM = "HS256"
_EXPIRE_HOURS = 8


def create_access_token(user_id: int, username: str) -> str:
    """
    Issue a signed HS256 JWT for an authenticated WeatherSelf user.
    Payload claims:
        sub      — string user_id (RFC 7519 subject)
        username — display name (convenience, not authoritative)
        iat      — issued-at timestamp
        exp      — expiry (iat + 8 hours)
    """
    now = datetime.utcnow()
    payload = {
        "sub": str(user_id),
        "username": username,
        "iat": now,
        "exp": now + timedelta(hours=_EXPIRE_HOURS),
    }
    return jwt.encode(payload, _SECRET, algorithm=_ALGORITHM)


def verify_token(token: str) -> dict:
    """
    Decode and validate a WeatherSelf JWT.
    Returns the full payload dict on success.
    Raises HTTP 401 if the token is missing, expired, or tampered with.
    """
    try:
        payload = jwt.decode(token, _SECRET, algorithms=[_ALGORITHM])
    except JWTError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token invalid or expired — please log in again",
            headers={"WWW-Authenticate": "Bearer"},
        ) from exc

    if not payload.get("sub"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token missing subject claim",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return payload
