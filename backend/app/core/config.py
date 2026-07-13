from __future__ import annotations

from functools import lru_cache

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

from app.core.database_url import normalize_database_url
from app.services.phone import normalize_ksa


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    ENV: str = "production"

    # Database — accepts EasyPanel postgres:// or postgresql+psycopg://
    # EasyPanel internal: postgres://lamsaglow:PASS@lamsaglow_database:5432/lamsaglow?sslmode=disable
    DATABASE_URL: str = "postgresql+psycopg://lamsaglow:devpassword@localhost:5432/lamsaglow"

    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def _normalize_db_url(cls, v: object) -> object:
        if isinstance(v, str):
            return normalize_database_url(v)
        return v

    # CORS — comma separated list of allowed origins
    CORS_ORIGINS: list[str] = ["https://lamsaglow.shop", "https://www.lamsaglow.shop"]

    # Admin token for internal endpoints
    ADMIN_TOKEN: str = "change-me"

    # Google Sheet webhook (Apps Script Web App)
    GOOGLE_SHEET_WEBHOOK_URL: str | None = None
    SHEET_SHARED_SECRET: str | None = None

    # CAPI master switch
    ENABLE_CAPI: bool = True

    # Meta Conversions API
    META_PIXEL_ID: str | None = None
    META_CAPI_TOKEN: str | None = None
    META_TEST_EVENT_CODE: str | None = None
    META_API_VERSION: str = "v21.0"

    # TikTok Events API
    TIKTOK_PIXEL_ID: str | None = None
    TIKTOK_CAPI_TOKEN: str | None = None
    TIKTOK_TEST_EVENT_CODE: str | None = None

    # Snapchat Conversions API
    SNAP_PIXEL_ID: str | None = None
    SNAP_CAPI_TOKEN: str | None = None

    # MaxMind GeoIP2 Insights — order fraud/geo gate (KSA only, block VPN/proxy)
    MAXMIND_ORDER_CHECK_ENABLED: bool = True
    MAXMIND_ACCOUNT_ID: str | None = None
    MAXMIND_LICENSE_KEY: str | None = None

    # Comma-separated KSA phones that bypass geo check (for prod testing)
    ORDER_WHITELIST_PHONES: list[str] = ["0550000000"]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def _split_origins(cls, v: object) -> object:
        if isinstance(v, str):
            return [o.strip() for o in v.split(",") if o.strip()]
        return v

    @field_validator("ORDER_WHITELIST_PHONES", mode="before")
    @classmethod
    def _split_whitelist(cls, v: object) -> object:
        if isinstance(v, str):
            return [p.strip() for p in v.split(",") if p.strip()]
        return v

    @property
    def whitelist_phones_normalized(self) -> set[str]:
        out: set[str] = set()
        for raw in self.ORDER_WHITELIST_PHONES:
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
