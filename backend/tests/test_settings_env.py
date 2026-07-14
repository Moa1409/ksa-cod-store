"""Regression: EasyPanel passes comma-separated lists, not JSON."""

from __future__ import annotations

import os

from app.core.config import Settings


def test_cors_origins_comma_separated(monkeypatch):
    monkeypatch.setenv(
        "CORS_ORIGINS",
        "https://lamsaglow.shop,https://www.lamsaglow.shop",
    )
    monkeypatch.setenv(
        "DATABASE_URL",
        "postgres://u:p@localhost:5432/db?sslmode=disable",
    )
    s = Settings()
    assert s.CORS_ORIGINS == [
        "https://lamsaglow.shop",
        "https://www.lamsaglow.shop",
    ]


def test_whitelist_phones_plain_string(monkeypatch):
    monkeypatch.setenv("ORDER_WHITELIST_PHONES", "0550000000")
    monkeypatch.setenv(
        "DATABASE_URL",
        "postgres://u:p@localhost:5432/db?sslmode=disable",
    )
    s = Settings()
    assert "0550000000" in s.ORDER_WHITELIST_PHONES or "966550000000" in s.whitelist_phones_normalized
