#!/bin/bash
set -e

echo "==> Generando APP_KEY..."
php artisan key:generate --no-interaction --force

echo "==> Generando JWT secret..."
php artisan jwt:secret --no-interaction --force

echo "==> Ejecutando migraciones y seeders..."
php artisan migrate:fresh --seed --no-interaction --force

echo "==> Limpiando caché..."
php artisan config:clear
php artisan route:clear

echo "==> Levantando servidor..."
exec php artisan serve --host=0.0.0.0 --port=8000
