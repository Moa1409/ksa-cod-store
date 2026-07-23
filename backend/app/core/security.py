from __future__ import annotations

import hashlib
import hmac
import secrets
import time
from dataclasses import dataclass

from fastapi import Header, HTTPException, status

from app.core.config import settings

# Session tokens expire after 12 hours
SESSION_TTL_SECONDS = 12 * 60 * 60


@dataclass(frozen=True)
class AdminIdentity:
    via: str  # "token" | "session"
    username: str | None = None


def _sign(payload: str) -> str:
    secret = (settings.ADMIN_SESSION_SECRET or settings.ADMIN_TOKEN or "dev").encode()
    return hmac.new(secret, payload.encode(), hashlib.sha256).hexdigest()


def create_admin_session(username: str) -> str:
    """Return opaque session token: base.expiry.sig"""
    exp = int(time.time()) + SESSION_TTL_SECONDS
    nonce = secrets.token_hex(8)
    body = f"{username}|{exp}|{nonce}"
    return f"{body}.{_sign(body)}"


def verify_admin_session(token: str) -> str | None:
    """Return username if session is valid."""
    try:
        body, sig = token.rsplit(".", 1)
    except ValueError:
        return None
    if not hmac.compare_digest(_sign(body), sig):
        return None
    parts = body.split("|")
    if len(parts) != 3:
        return None
    username, exp_s, _nonce = parts
    try:
        exp = int(exp_s)
    except ValueError:
        return None
    if exp < int(time.time()):
        return None
    if username != settings.ADMIN_USERNAME:
        return None
    return username


def verify_admin_password(username: str, password: str) -> bool:
    user_ok = hmac.compare_digest(username.strip(), settings.ADMIN_USERNAME)
    pass_ok = hmac.compare_digest(password, settings.ADMIN_PASSWORD)
    return user_ok and pass_ok


def require_admin(
    x_admin_token: str | None = Header(default=None),
    authorization: str | None = Header(default=None),
) -> AdminIdentity:
    """Accept either X-Admin-Token (API key) or Authorization: Bearer <session>."""
    if x_admin_token and hmac.compare_digest(x_admin_token, settings.ADMIN_TOKEN):
        return AdminIdentity(via="token")

    if authorization and authorization.lower().startswith("bearer "):
        session = authorization[7:].strip()
        username = verify_admin_session(session)
        if username:
            return AdminIdentity(via="session", username=username)

    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="unauthorized")
