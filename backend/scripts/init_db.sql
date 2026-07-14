-- Run this in EasyPanel → Database → lamsaglow → Query tab if tables are still missing.
-- Safe to run multiple times (uses IF NOT EXISTS).

CREATE TABLE IF NOT EXISTS alembic_version (
    version_num VARCHAR(32) NOT NULL PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY,
    order_number VARCHAR(32) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    status VARCHAR(24) NOT NULL DEFAULT 'new',
    customer_name VARCHAR(120) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    phone_e164 VARCHAR(20) NOT NULL,
    city VARCHAR(80),
    items JSONB NOT NULL,
    num_items INTEGER NOT NULL DEFAULT 0,
    bundle_subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0,
    upsell_taken BOOLEAN NOT NULL DEFAULT false,
    upsell_slug VARCHAR(64),
    upsell_price NUMERIC(10, 2),
    total NUMERIC(10, 2) NOT NULL DEFAULT 0,
    currency VARCHAR(8) NOT NULL DEFAULT 'SAR',
    event_id VARCHAR(120),
    fbp VARCHAR(255),
    fbc VARCHAR(255),
    ttp VARCHAR(255),
    sc_click_id VARCHAR(255),
    client_ip VARCHAR(64),
    user_agent VARCHAR(512),
    landing_url VARCHAR(1024),
    utm JSONB,
    sheet_synced BOOLEAN NOT NULL DEFAULT false,
    capi_result JSONB,
    notes VARCHAR(1024)
);

CREATE UNIQUE INDEX IF NOT EXISTS ix_orders_order_number ON orders (order_number);
CREATE INDEX IF NOT EXISTS ix_orders_phone ON orders (phone);
CREATE INDEX IF NOT EXISTS ix_orders_created_at ON orders (created_at);
CREATE INDEX IF NOT EXISTS ix_orders_event_id ON orders (event_id);

CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    slug VARCHAR(64) NOT NULL,
    name VARCHAR(120) NOT NULL,
    qty INTEGER NOT NULL DEFAULT 1,
    unit_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
    is_upsell BOOLEAN NOT NULL DEFAULT false,
    sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS ix_order_items_order_id ON order_items (order_id);

CREATE TABLE IF NOT EXISTS tracking_events (
    id UUID PRIMARY KEY,
    event_name VARCHAR(64) NOT NULL,
    event_id VARCHAR(120) NOT NULL,
    event_time TIMESTAMPTZ NOT NULL DEFAULT now(),
    value NUMERIC(10, 2),
    currency VARCHAR(8) NOT NULL DEFAULT 'SAR',
    contents JSONB NOT NULL DEFAULT '[]',
    num_items INTEGER NOT NULL DEFAULT 0,
    event_source_url VARCHAR(1024),
    phone VARCHAR(20),
    client_ip VARCHAR(64),
    user_agent VARCHAR(512),
    fbp VARCHAR(255),
    fbc VARCHAR(255),
    ttp VARCHAR(255),
    sc_click_id VARCHAR(255),
    utm JSONB,
    order_number VARCHAR(32),
    dispatched BOOLEAN NOT NULL DEFAULT false,
    capi_result JSONB
);

CREATE UNIQUE INDEX IF NOT EXISTS ix_tracking_events_event_id ON tracking_events (event_id);
CREATE INDEX IF NOT EXISTS ix_tracking_events_event_name ON tracking_events (event_name);
CREATE INDEX IF NOT EXISTS ix_tracking_events_event_time ON tracking_events (event_time);
CREATE INDEX IF NOT EXISTS ix_tracking_events_phone ON tracking_events (phone);
CREATE INDEX IF NOT EXISTS ix_tracking_events_order_number ON tracking_events (order_number);

INSERT INTO alembic_version (version_num)
VALUES ('0002_order_items_tracking')
ON CONFLICT (version_num) DO NOTHING;

-- Alembic allows only ONE current revision. Remove older heads if present.
DELETE FROM alembic_version WHERE version_num <> '0002_order_items_tracking';

