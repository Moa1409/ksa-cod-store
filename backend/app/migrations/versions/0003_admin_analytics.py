"""admin geo fields + site_events analytics

Revision ID: 0003_admin_analytics
Revises: 0002_order_items_tracking
Create Date: 2026-07-23

"""
from __future__ import annotations

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "0003_admin_analytics"
down_revision: Union[str, None] = "0002_order_items_tracking"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("orders", sa.Column("geo_country", sa.String(length=8), nullable=True))
    op.add_column("orders", sa.Column("geo_allowed", sa.Boolean(), nullable=True))
    op.add_column("orders", sa.Column("geo_vpn", sa.Boolean(), nullable=True))
    op.add_column("orders", sa.Column("geo_reason", sa.String(length=64), nullable=True))
    op.add_column("orders", sa.Column("geo_trait", sa.String(length=64), nullable=True))
    op.create_index("ix_orders_geo_allowed", "orders", ["geo_allowed"])
    op.create_index("ix_orders_status", "orders", ["status"])

    op.create_table(
        "site_events",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("event_type", sa.String(length=32), nullable=False),
        sa.Column("path", sa.String(length=512), nullable=True),
        sa.Column("product_slug", sa.String(length=64), nullable=True),
        sa.Column("label", sa.String(length=120), nullable=True),
        sa.Column("session_id", sa.String(length=64), nullable=True),
        sa.Column("referrer", sa.String(length=1024), nullable=True),
        sa.Column("utm", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column("client_ip", sa.String(length=64), nullable=True),
        sa.Column("user_agent", sa.String(length=512), nullable=True),
        sa.Column("geo_country", sa.String(length=8), nullable=True),
        sa.Column("geo_vpn", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("geo_reason", sa.String(length=64), nullable=True),
        sa.Column("geo_trait", sa.String(length=64), nullable=True),
        sa.Column("counted", sa.Boolean(), nullable=False, server_default=sa.false()),
    )
    op.create_index("ix_site_events_created_at", "site_events", ["created_at"])
    op.create_index("ix_site_events_event_type", "site_events", ["event_type"])
    op.create_index("ix_site_events_counted", "site_events", ["counted"])
    op.create_index("ix_site_events_session_id", "site_events", ["session_id"])


def downgrade() -> None:
    op.drop_index("ix_site_events_session_id", table_name="site_events")
    op.drop_index("ix_site_events_counted", table_name="site_events")
    op.drop_index("ix_site_events_event_type", table_name="site_events")
    op.drop_index("ix_site_events_created_at", table_name="site_events")
    op.drop_table("site_events")

    op.drop_index("ix_orders_status", table_name="orders")
    op.drop_index("ix_orders_geo_allowed", table_name="orders")
    op.drop_column("orders", "geo_trait")
    op.drop_column("orders", "geo_reason")
    op.drop_column("orders", "geo_vpn")
    op.drop_column("orders", "geo_allowed")
    op.drop_column("orders", "geo_country")
