INSERT INTO alembic_version (version_num) VALUES ('0001_init') ON CONFLICT (version_num) DO NOTHING;
