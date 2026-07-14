"""add order_items and tracking_events tables

Revision ID: 0002_order_items_tracking
Revises: 0001_init
Create Date: 2026-07-13

"""
from __future__ import annotations

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "0002_order_items_tracking"
down_revision: Union[str, None] = "0001_init"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "order_items",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("order_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("slug", sa.String(length=64), nullable=False),
        sa.Column("name", sa.String(length=120), nullable=False),
        sa.Column("qty", sa.Integer(), nullable=False, server_default="1"),
        sa.Column("unit_price", sa.Numeric(10, 2), nullable=False, server_default="0"),
        sa.Column("is_upsell", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        sa.ForeignKeyConstraint(["order_id"], ["orders.id"], ondelete="CASCADE"),
    )
    op.create_index("ix_order_items_order_id", "order_items", ["order_id"])

    op.create_table(
        "tracking_events",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("event_name", sa.String(length=64), nullable=False),
        sa.Column("event_id", sa.String(length=120), nullable=False),
        sa.Column(
            "event_time",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.Column("value", sa.Numeric(10, 2), nullable=True),
        sa.Column("currency", sa.String(length=8), nullable=False, server_default="SAR"),
        sa.Column(
            "contents",
            postgresql.JSONB(astext_type=sa.Text()),
            nullable=False,
            server_default="[]",
        ),
        sa.Column("num_items", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("event_source_url", sa.String(length=1024), nullable=True),
        sa.Column("phone", sa.String(length=20), nullable=True),
        sa.Column("client_ip", sa.String(length=64), nullable=True),
        sa.Column("user_agent", sa.String(length=512), nullable=True),
        sa.Column("fbp", sa.String(length=255), nullable=True),
        sa.Column("fbc", sa.String(length=255), nullable=True),
        sa.Column("ttp", sa.String(length=255), nullable=True),
        sa.Column("sc_click_id", sa.String(length=255), nullable=True),
        sa.Column("utm", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column("order_number", sa.String(length=32), nullable=True),
        sa.Column("dispatched", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("capi_result", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
    )
    op.create_index("ix_tracking_events_event_name", "tracking_events", ["event_name"])
    op.create_index("ix_tracking_events_event_id", "tracking_events", ["event_id"], unique=True)
    op.create_index("ix_tracking_events_event_time", "tracking_events", ["event_time"])
    op.create_index("ix_tracking_events_phone", "tracking_events", ["phone"])
    op.create_index("ix_tracking_events_order_number", "tracking_events", ["order_number"])


def downgrade() -> None:
    op.drop_index("ix_tracking_events_order_number", table_name="tracking_events")
    op.drop_index("ix_tracking_events_phone", table_name="tracking_events")
    op.drop_index("ix_tracking_events_event_time", table_name="tracking_events")
    op.drop_index("ix_tracking_events_event_id", table_name="tracking_events")
    op.drop_index("ix_tracking_events_event_name", table_name="tracking_events")
    op.drop_table("tracking_events")
    op.drop_index("ix_order_items_order_id", table_name="order_items")
    op.drop_table("order_items")
