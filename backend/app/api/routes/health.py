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
    try:
        db.execute(text("SELECT 1"))
    except Exception:  # noqa: BLE001
        db_ok = "error"
    return {"status": "ok", "db": db_ok}
