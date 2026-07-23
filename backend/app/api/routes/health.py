from __future__ import annotations  # redeploy-nudge-admin-v2

from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.config import settings
from app.services.geoip import maxmind_configured
from app.services.sheets import ping_sheet_webhook

router = APIRouter()

BUILD_ID = "admin-2026-07-23c"


@router.get("/")
def root() -> dict:
    return {"service": "lamsa-glow-api", "status": "ok", "build": BUILD_ID, "admin": True}


@router.get("/health")
def health(db: Session = Depends(get_db)) -> dict:
    db_ok = "ok"
    tables = 0
    try:
        db.execute(text("SELECT 1"))
        row = db.execute(
            text(
                "SELECT COUNT(*) FROM information_schema.tables "
                "WHERE table_schema = 'public' AND table_type = 'BASE TABLE'"
            )
        ).scalar()
        tables = int(row or 0)
    except Exception:  # noqa: BLE001
        db_ok = "error"
    return {
        "status": "ok",
        "build": BUILD_ID,
        "admin": True,
        "db": db_ok,
        "tables": tables,
        "migrations_ok": tables >= 4,
        "geo_check": settings.MAXMIND_ORDER_CHECK_ENABLED,
        "maxmind": "configured" if maxmind_configured() else "missing",
        "block_vpn_proxy": settings.MAXMIND_BLOCK_VPN_PROXY,
        "require_ksa": settings.MAXMIND_REQUIRE_KSA,
        "sheet_webhook": "configured" if settings.GOOGLE_SHEET_WEBHOOK_URL else "missing",
        "sheet_secret": "configured" if settings.SHEET_SHARED_SECRET else "missing",
        "sheet_ping": ping_sheet_webhook(),
    }
