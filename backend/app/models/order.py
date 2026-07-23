from __future__ import annotations

import uuid
from datetime import datetime

from typing import TYPE_CHECKING

from sqlalchemy import Boolean, DateTime, Integer, Numeric, String, func
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.order_item import OrderItem


class Order(Base):
    __tablename__ = "orders"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    order_number: Mapped[str] = mapped_column(String(32), unique=True, index=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), index=True
    )
    status: Mapped[str] = mapped_column(String(24), default="new")

    # customer
    customer_name: Mapped[str] = mapped_column(String(120))
    phone: Mapped[str] = mapped_column(String(20), index=True)  # 9665XXXXXXXX
    phone_e164: Mapped[str] = mapped_column(String(20))  # +9665XXXXXXXX
    city: Mapped[str | None] = mapped_column(String(80), nullable=True)

    # contents
    items: Mapped[list] = mapped_column(JSONB)  # [{slug,name,qty,unit_price}]
    num_items: Mapped[int] = mapped_column(Integer, default=0)
    bundle_subtotal: Mapped[float] = mapped_column(Numeric(10, 2), default=0)
    upsell_taken: Mapped[bool] = mapped_column(Boolean, default=False)
    upsell_slug: Mapped[str | None] = mapped_column(String(64), nullable=True)
    upsell_price: Mapped[float | None] = mapped_column(Numeric(10, 2), nullable=True)
    total: Mapped[float] = mapped_column(Numeric(10, 2), default=0)
    currency: Mapped[str] = mapped_column(String(8), default="SAR")

    # attribution / CAPI matching
    event_id: Mapped[str | None] = mapped_column(String(120), index=True, nullable=True)
    fbp: Mapped[str | None] = mapped_column(String(255), nullable=True)
    fbc: Mapped[str | None] = mapped_column(String(255), nullable=True)
    ttp: Mapped[str | None] = mapped_column(String(255), nullable=True)
    sc_click_id: Mapped[str | None] = mapped_column(String(255), nullable=True)
    client_ip: Mapped[str | None] = mapped_column(String(64), nullable=True)
    user_agent: Mapped[str | None] = mapped_column(String(512), nullable=True)
    landing_url: Mapped[str | None] = mapped_column(String(1024), nullable=True)
    utm: Mapped[dict | None] = mapped_column(JSONB, nullable=True)

    # MaxMind geo snapshot (at order time)
    geo_country: Mapped[str | None] = mapped_column(String(8), nullable=True)
    geo_allowed: Mapped[bool | None] = mapped_column(Boolean, nullable=True, index=True)
    geo_vpn: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    geo_reason: Mapped[str | None] = mapped_column(String(64), nullable=True)
    geo_trait: Mapped[str | None] = mapped_column(String(64), nullable=True)

    # ops
    sheet_synced: Mapped[bool] = mapped_column(Boolean, default=False)
    capi_result: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    notes: Mapped[str | None] = mapped_column(String(1024), nullable=True)

    order_items: Mapped[list[OrderItem]] = relationship(
        "OrderItem",
        back_populates="order",
        cascade="all, delete-orphan",
        order_by="OrderItem.sort_order",
    )

    def items_as_dicts(self) -> list[dict]:
        """Normalized line items — prefers order_items rows, falls back to legacy JSONB."""
        if self.order_items:
            rows: list[dict] = []
            for row in self.order_items:
                item = {
                    "slug": row.slug,
                    "name": row.name,
                    "qty": row.qty,
                    "unit_price": float(row.unit_price),
                }
                if row.is_upsell:
                    item["upsell"] = True
                rows.append(item)
            return rows
        return list(self.items or [])
