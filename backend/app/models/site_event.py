from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, String, func
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class SiteEvent(Base):
    """First-party analytics. counted=True only for valid KSA non-VPN traffic."""

    __tablename__ = "site_events"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), index=True
    )
    event_type: Mapped[str] = mapped_column(String(32), index=True)  # page_view | click | ...
    path: Mapped[str | None] = mapped_column(String(512), nullable=True)
    product_slug: Mapped[str | None] = mapped_column(String(64), nullable=True)
    label: Mapped[str | None] = mapped_column(String(120), nullable=True)
    session_id: Mapped[str | None] = mapped_column(String(64), nullable=True, index=True)
    referrer: Mapped[str | None] = mapped_column(String(1024), nullable=True)
    utm: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    client_ip: Mapped[str | None] = mapped_column(String(64), nullable=True)
    user_agent: Mapped[str | None] = mapped_column(String(512), nullable=True)
    geo_country: Mapped[str | None] = mapped_column(String(8), nullable=True)
    geo_vpn: Mapped[bool] = mapped_column(Boolean, default=False)
    geo_reason: Mapped[str | None] = mapped_column(String(64), nullable=True)
    geo_trait: Mapped[str | None] = mapped_column(String(64), nullable=True)
    counted: Mapped[bool] = mapped_column(Boolean, default=False, index=True)
