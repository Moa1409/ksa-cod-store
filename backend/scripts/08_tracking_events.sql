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
