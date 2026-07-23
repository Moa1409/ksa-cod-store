from __future__ import annotations

from functools import lru_cache

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

from app.core.database_url import normalize_database_url
from app.services.phone import normalize_ksa


def _csv_to_list(value: str) -> list[str]:
    s = (value or "").strip()
    if not s:
        return []
    if s.startswith("["):
        import json

        try:
            parsed = json.loads(s)
            if isinstance(parsed, list):
                return [str(x).strip() for x in parsed if str(x).strip()]
        except json.JSONDecodeError:
            pass
    return [p.strip() for p in s.split(",") if p.strip()]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    ENV: str = "production"

    # Database — accepts EasyPanel postgres:// or postgresql+psycopg://
    DATABASE_URL: str = "postgresql+psycopg://lamsaglow:devpassword@localhost:5432/lamsaglow"

    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def _normalize_db_url(cls, v: object) -> object:
        if isinstance(v, str):
            return normalize_database_url(v)
        return v

    # Keep as str so EasyPanel comma-separated values never hit JSON list decoding
    CORS_ORIGINS: str = "https://lamsaglow.shop,https://www.lamsaglow.shop"

    ADMIN_TOKEN: str = "change-me"
    ADMIN_USERNAME: str = "admin"
    ADMIN_PASSWORD: str = "change-me-admin-password"
    ADMIN_SESSION_SECRET: str = "change-me-session-secret-long-random"

    GOOGLE_SHEET_WEBHOOK_URL: str | None = None
    SHEET_SHARED_SECRET: str | None = None

    ENABLE_CAPI: bool = True

    META_PIXEL_ID: str | None = None
    META_CAPI_TOKEN: str | None = None
    META_TEST_EVENT_CODE: str | None = None
    META_API_VERSION: str = "v21.0"

    TIKTOK_PIXEL_ID: str | None = None
    TIKTOK_CAPI_TOKEN: str | None = None
    TIKTOK_TEST_EVENT_CODE: str | None = None

    SNAP_PIXEL_ID: str | None = None
    SNAP_CAPI_TOKEN: str | None = None

    MAXMIND_ORDER_CHECK_ENABLED: bool = True
    MAXMIND_ACCOUNT_ID: str | None = None
    MAXMIND_LICENSE_KEY: str | None = None
    MAXMIND_REQUIRE_KSA: bool = True
    MAXMIND_BLOCK_VPN_PROXY: bool = True

    ORDER_WHITELIST_PHONES: str = "0550000000"

    # Phones exempt from fake-number checks (testing only)
    TEST_ORDER_PHONES: str = "0550000000"

    @property
    def cors_origins_list(self) -> list[str]:
        return _csv_to_list(self.CORS_ORIGINS)

    @property
    def whitelist_phones_list(self) -> list[str]:
        return _csv_to_list(self.ORDER_WHITELIST_PHONES)

    @property
    def whitelist_phones_normalized(self) -> set[str]:
        out: set[str] = set()
        for raw in self.whitelist_phones_list:
            n = normalize_ksa(raw)
            if n:
                out.add(n)
        return out

    @property
    def test_order_phones_list(self) -> list[str]:
        return _csv_to_list(self.TEST_ORDER_PHONES)

    @property
    def test_order_phones_normalized(self) -> set[str]:
        out: set[str] = set()
        for raw in self.test_order_phones_list:
            n = normalize_ksa(raw)
            if n:
                out.add(n)
        return out

    @property
    def is_prod(self) -> bool:
        return self.ENV.lower() in {"production", "prod"}


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
