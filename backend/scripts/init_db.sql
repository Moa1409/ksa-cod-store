-- Run this in EasyPanel → Database → lamsaglow → Query tab if tables are still 0.
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

INSERT INTO alembic_version (version_num)
VALUES ('0001_init')
ON CONFLICT (version_num) DO NOTHING;
