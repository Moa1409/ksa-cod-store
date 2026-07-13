from app.core.database_url import normalize_database_url


def test_normalize_postgres_url():
    raw = "postgres://lamsaglow:pass@lamsaglow_database:5432/lamsaglow?sslmode=disable"
    out = normalize_database_url(raw)
    assert out.startswith("postgresql+psycopg://")
    assert "lamsaglow_database" in out


def test_normalize_postgresql_url():
    raw = "postgresql://user:pass@host:5432/db"
    out = normalize_database_url(raw)
    assert out == "postgresql+psycopg://user:pass@host:5432/db"


def test_passthrough_psycopg():
    raw = "postgresql+psycopg://user:pass@host:5432/db"
    assert normalize_database_url(raw) == raw
