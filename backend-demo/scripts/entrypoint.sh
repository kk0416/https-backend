#!/bin/sh
set -eu

HOST="${SERVER_HOST:-0.0.0.0}"
PORT="${SERVER_PORT:-8443}"
CERT_FILE="${SSL_CERT_FILE:-/app/certs/server.crt}"
KEY_FILE="${SSL_KEY_FILE:-/app/certs/server.key}"

mkdir -p /app/certs
mkdir -p /app/data
mkdir -p "$(dirname "$CERT_FILE")"
mkdir -p "$(dirname "$KEY_FILE")"

if [ ! -f "$CERT_FILE" ] || [ ! -f "$KEY_FILE" ]; then
  echo "[entrypoint] TLS files not found. Generating self-signed certificate..."
  openssl req -x509 -nodes \
    -newkey rsa:2048 \
    -keyout "$KEY_FILE" \
    -out "$CERT_FILE" \
    -days 3650 \
    -subj "/CN=localhost"
fi

echo "[entrypoint] Applying Prisma migrations..."
npx prisma migrate deploy

echo "[entrypoint] Starting gaussian-backend-demo on ${HOST}:${PORT}"
exec node dist/main.js
