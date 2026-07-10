from __future__ import annotations

from fastapi import Request


def client_ip(request: Request) -> str | None:
    """Real client IP behind the EasyPanel/Traefik proxy."""
    xff = request.headers.get("x-forwarded-for")
    if xff:
        return xff.split(",")[0].strip()
    real = request.headers.get("x-real-ip")
    if real:
        return real.strip()
    return request.client.host if request.client else None


def user_agent(request: Request) -> str | None:
    return request.headers.get("user-agent")
