"""Normalize database URLs from EasyPanel / Heroku style env vars."""

from __future__ import annotations


def normalize_database_url(url: str) -> str:
    """Convert postgres:// and postgresql:// to postgresql+psycopg:// for SQLAlchemy 2."""
    u = url.strip()
    if u.startswith("postgres://"):
        return "postgresql+psycopg://" + u[len("postgres://") :]
    if u.startswith("postgresql://") and "+psycopg" not in u.split("://", 1)[0]:
        return "postgresql+psycopg://" + u[len("postgresql://") :]
    return u
