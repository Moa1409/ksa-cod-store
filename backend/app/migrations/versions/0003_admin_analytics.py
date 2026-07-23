"""admin geo fields + site_events analytics

Revision ID: 0003_admin_analytics
Revises: 0002_order_items_tracking
Create Date: 2026-07-23

Idempotent: columns/table may already exist if scripts/10_admin_analytics.sql was run manually.
"""
from __future__ import annotations

from typing import Sequence, Union

from alembic import op

revision: str = "0003_admin_analytics"
down_revision: Union[str, None] = "0002_order_items_tracking"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        """
        ALTER TABLE orders ADD COLUMN IF NOT EXISTS geo_country VARCHAR(8);
        ALTER TABLE orders ADD COLUMN IF NOT EXISTS geo_allowed BOOLEAN;
        ALTER TABLE orders ADD COLUMN IF NOT EXISTS geo_vpn BOOLEAN;
        ALTER TABLE orders ADD COLUMN IF NOT EXISTS geo_reason VARCHAR(64);
        ALTER TABLE orders ADD COLUMN IF NOT EXISTS geo_trait VARCHAR(64);

        CREATE INDEX IF NOT EXISTS ix_orders_geo_allowed ON orders (geo_allowed);
        CREATE INDEX IF NOT EXISTS ix_orders_status ON orders (status);

        CREATE TABLE IF NOT EXISTS site_events (
          id UUID PRIMARY KEY,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          event_type VARCHAR(32) NOT NULL,
          path VARCHAR(512),
          product_slug VARCHAR(64),
          label VARCHAR(120),
          session_id VARCHAR(64),
          referrer VARCHAR(1024),
          utm JSONB,
          client_ip VARCHAR(64),
          user_agent VARCHAR(512),
          geo_country VARCHAR(8),
          geo_vpn BOOLEAN NOT NULL DEFAULT false,
          geo_reason VARCHAR(64),
          geo_trait VARCHAR(64),
          counted BOOLEAN NOT NULL DEFAULT false
        );

        CREATE INDEX IF NOT EXISTS ix_site_events_created_at ON site_events (created_at);
        CREATE INDEX IF NOT EXISTS ix_site_events_event_type ON site_events (event_type);
        CREATE INDEX IF NOT EXISTS ix_site_events_counted ON site_events (counted);
        CREATE INDEX IF NOT EXISTS ix_site_events_session_id ON site_events (session_id);
        """
    )


def downgrade() -> None:
    op.execute(
        """
        DROP INDEX IF EXISTS ix_site_events_session_id;
        DROP INDEX IF EXISTS ix_site_events_counted;
        DROP INDEX IF EXISTS ix_site_events_event_type;
        DROP INDEX IF EXISTS ix_site_events_created_at;
        DROP TABLE IF EXISTS site_events;
        DROP INDEX IF EXISTS ix_orders_status;
        DROP INDEX IF EXISTS ix_orders_geo_allowed;
        ALTER TABLE orders DROP COLUMN IF EXISTS geo_trait;
        ALTER TABLE orders DROP COLUMN IF EXISTS geo_reason;
        ALTER TABLE orders DROP COLUMN IF EXISTS geo_vpn;
        ALTER TABLE orders DROP COLUMN IF EXISTS geo_allowed;
        ALTER TABLE orders DROP COLUMN IF EXISTS geo_country;
        """
    )
