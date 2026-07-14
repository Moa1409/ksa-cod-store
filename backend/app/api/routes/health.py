from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.db.session import get_db

router = APIRouter()


@router.get("/")
def root() -> dict:
    return {"service": "lamsa-glow-api", "status": "ok"}


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
        "db": db_ok,
        "tables": tables,
        "migrations_ok": tables >= 4,
    }
