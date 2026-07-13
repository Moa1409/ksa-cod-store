#!/usr/bin/env sh
set -eu

echo "=== Lamsa Glow API startup ==="
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
