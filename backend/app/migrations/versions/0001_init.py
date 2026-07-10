"""init orders table

Revision ID: 0001_init
Revises:
Create Date: 2026-07-08

"""
from __future__ import annotations

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "0001_init"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "orders",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("order_number", sa.String(length=32), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.Column("status", sa.String(length=24), nullable=False, server_default="new"),
        sa.Column("customer_name", sa.String(length=120), nullable=False),
        sa.Column("phone", sa.String(length=20), nullable=False),
        sa.Column("phone_e164", sa.String(length=20), nullable=False),
        sa.Column("city", sa.String(length=80), nullable=True),
        sa.Column("items", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("num_items", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("bundle_subtotal", sa.Numeric(10, 2), nullable=False, server_default="0"),
        sa.Column("upsell_taken", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("upsell_slug", sa.String(length=64), nullable=True),
        sa.Column("upsell_price", sa.Numeric(10, 2), nullable=True),
        sa.Column("total", sa.Numeric(10, 2), nullable=False, server_default="0"),
        sa.Column("currency", sa.String(length=8), nullable=False, server_default="SAR"),
        sa.Column("event_id", sa.String(length=120), nullable=True),
        sa.Column("fbp", sa.String(length=255), nullable=True),
        sa.Column("fbc", sa.String(length=255), nullable=True),
        sa.Column("ttp", sa.String(length=255), nullable=True),
        sa.Column("sc_click_id", sa.String(length=255), nullable=True),
        sa.Column("client_ip", sa.String(length=64), nullable=True),
        sa.Column("user_agent", sa.String(length=512), nullable=True),
        sa.Column("landing_url", sa.String(length=1024), nullable=True),
        sa.Column("utm", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column("sheet_synced", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("capi_result", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column("notes", sa.String(length=1024), nullable=True),
    )
    op.create_index("ix_orders_order_number", "orders", ["order_number"], unique=True)
    op.create_index("ix_orders_phone", "orders", ["phone"])
    op.create_index("ix_orders_created_at", "orders", ["created_at"])
    op.create_index("ix_orders_event_id", "orders", ["event_id"])


def downgrade() -> None:
    op.drop_index("ix_orders_event_id", table_name="orders")
    op.drop_index("ix_orders_created_at", table_name="orders")
    op.drop_index("ix_orders_phone", table_name="orders")
    op.drop_index("ix_orders_order_number", table_name="orders")
    op.drop_table("orders")
