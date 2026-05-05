#!/bin/sh
set -e

echo "==> Fijando permisos de storage..."
chmod -R 777 storage bootstrap/cache

echo "==> Generando APP_KEY..."
php artisan key:generate --no-interaction --force

echo "==> Generando JWT secret..."
php artisan jwt:secret --no-interaction --force

echo "==> Limpiando caché de configuración..."
php artisan config:clear

echo "==> Ejecutando migraciones y seeders..."
php artisan migrate:fresh --seed --no-interaction --force

echo "==> Limpiando rutas..."
php artisan route:clear

echo "==> Levantando servidor..."
exec php artisan serve --host=0.0.0.0 --port=8000
