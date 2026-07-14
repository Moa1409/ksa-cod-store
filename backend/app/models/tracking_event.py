from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Integer, Numeric, String, func
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class TrackingEvent(Base):
    __tablename__ = "tracking_events"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    event_name: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    event_id: Mapped[str] = mapped_column(String(120), nullable=False, unique=True, index=True)
    event_time: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False, index=True
    )
    value: Mapped[float | None] = mapped_column(Numeric(10, 2), nullable=True)
    currency: Mapped[str] = mapped_column(String(8), nullable=False, default="SAR")
    contents: Mapped[list] = mapped_column(JSONB, nullable=False, server_default="[]")
    num_items: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    event_source_url: Mapped[str | None] = mapped_column(String(1024), nullable=True)
    phone: Mapped[str | None] = mapped_column(String(20), nullable=True, index=True)
    client_ip: Mapped[str | None] = mapped_column(String(64), nullable=True)
    user_agent: Mapped[str | None] = mapped_column(String(512), nullable=True)
    fbp: Mapped[str | None] = mapped_column(String(255), nullable=True)
    fbc: Mapped[str | None] = mapped_column(String(255), nullable=True)
    ttp: Mapped[str | None] = mapped_column(String(255), nullable=True)
    sc_click_id: Mapped[str | None] = mapped_column(String(255), nullable=True)
    utm: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    order_number: Mapped[str | None] = mapped_column(String(32), nullable=True, index=True)
    dispatched: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    capi_result: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
