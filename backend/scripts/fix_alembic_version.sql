-- Fix Alembic "overlaps" error: keep ONLY the latest revision.
-- Paste into EasyPanel DB Query tab and Run.

DELETE FROM alembic_version;
INSERT INTO alembic_version (version_num) VALUES ('0002_order_items_tracking');

SELECT version_num FROM alembic_version;
