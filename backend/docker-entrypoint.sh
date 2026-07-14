#!/usr/bin/env sh
set -eu

echo "=== Lamsa Glow API startup ==="

# If alembic_version was manually seeded with BOTH 0001 and 0002 rows,
# Alembic fails with "overlaps". Keep a single head revision.
echo "Checking alembic_version consistency..."
python - <<'PY'
from sqlalchemy import create_engine, text
from app.core.config import settings

engine = create_engine(settings.DATABASE_URL)
with engine.begin() as conn:
    try:
        rows = conn.execute(text("SELECT version_num FROM alembic_version")).fetchall()
    except Exception as exc:  # noqa: BLE001
        print(f"alembic_version not ready yet: {exc}")
        raise SystemExit(0)
    versions = {r[0] for r in rows}
    print(f"alembic_version rows: {sorted(versions)}")
    if len(versions) > 1:
        print("Multiple alembic heads detected — stamping single head 0002_order_items_tracking")
        conn.execute(text("DELETE FROM alembic_version"))
        conn.execute(
            text("INSERT INTO alembic_version (version_num) VALUES ('0002_order_items_tracking')")
        )
PY

echo "Running database migrations..."

attempt=1
max_attempts=10
until python -m alembic upgrade head; do
  if [ "$attempt" -ge "$max_attempts" ]; then
    echo "ERROR: migrations failed after ${max_attempts} attempts."
    echo "Check DATABASE_URL in EasyPanel env (postgres:// is auto-converted)."
    exit 1
  fi
  echo "Migration attempt ${attempt} failed — retrying in 3s..."
  attempt=$((attempt + 1))
  sleep 3
done

echo "Migrations complete."
echo "Starting Gunicorn on :8000..."

exec gunicorn app.main:app \
  -k uvicorn.workers.UvicornWorker \
  -b 0.0.0.0:8000 \
  -w "${WEB_CONCURRENCY:-1}" \
  --timeout 60 \
  --access-logfile - \
  --error-logfile -
