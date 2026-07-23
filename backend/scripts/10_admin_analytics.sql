-- 0003 admin analytics — run in EasyPanel DB Query if alembic is unavailable
-- Safe to re-run: uses IF NOT EXISTS / DO blocks

-- Geo fields on orders
ALTER TABLE orders ADD COLUMN IF NOT EXISTS geo_country VARCHAR(8);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS geo_allowed BOOLEAN;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS geo_vpn BOOLEAN;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS geo_reason VARCHAR(64);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS geo_trait VARCHAR(64);

CREATE INDEX IF NOT EXISTS ix_orders_geo_allowed ON orders (geo_allowed);
CREATE INDEX IF NOT EXISTS ix_orders_status ON orders (status);

-- First-party site events (clicks / page views) — only counted=true for valid KSA non-VPN
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

-- Stamp alembic if you use migrations
-- INSERT INTO alembic_version(version_num) VALUES ('0003_admin_analytics')
--   ON CONFLICT DO NOTHING;
-- Or: UPDATE alembic_version SET version_num = '0003_admin_analytics';
