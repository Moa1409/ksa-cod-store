#!/usr/bin/env sh
set -e

echo "Running database migrations..."
alembic upgrade head

echo "Starting Gunicorn..."
exec gunicorn app.main:app \
  -k uvicorn.workers.UvicornWorker \
  -b 0.0.0.0:8000 \
  -w "${WEB_CONCURRENCY:-2}" \
  --timeout 60 \
  --access-logfile - \
  --error-logfile -
