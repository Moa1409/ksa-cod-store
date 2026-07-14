INSERT INTO alembic_version (version_num) VALUES ('0002_order_items_tracking')
ON CONFLICT (version_num) DO NOTHING;
