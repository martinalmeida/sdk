FROM php:8.4-fpm

#Dependencias del sistema
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libxml2-dev \
    libzip-dev \
    libonig-dev \
    zip \
    unzip \
    git \
    curl \
    libsodium-dev \
    default-mysql-client \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd pdo_mysql sodium pcntl mbstring xml dom zip \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

#Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

#Cache de dependencias
COPY composer.json composer.lock ./
RUN composer install --no-interaction --no-scripts --no-autoloader --prefer-dist

#Copiar proyecto
COPY . .

#Autoload optimizado
RUN composer dump-autoload --optimize

#Crear .env si no existe y configurarlo
RUN [ -f .env ] || cp .env.example .env
RUN sed -i 's/^DB_CONNECTION=.*/DB_CONNECTION=mysql/' .env && \
    sed -i 's/^DB_HOST=.*/DB_HOST=db/' .env && \
    sed -i 's/^DB_PORT=.*/DB_PORT=3306/' .env && \
    sed -i 's/^DB_DATABASE=.*/DB_DATABASE=martin/' .env && \
    sed -i 's/^DB_USERNAME=.*/DB_USERNAME=martin/' .env && \
    sed -i 's/^DB_PASSWORD=.*/DB_PASSWORD=root/' .env && \
    sed -i 's/^SESSION_DRIVER=.*/SESSION_DRIVER=file/' .env && \
    sed -i 's/^QUEUE_CONNECTION=.*/QUEUE_CONNECTION=sync/' .env && \
    sed -i 's/^CACHE_STORE=.*/CACHE_STORE=file/' .env

#Publicar config de JWT (necesita .env ya configurado)
RUN php artisan vendor:publish \
    --provider="PHPOpenSourceSaver\JWTAuth\Providers\LaravelServiceProvider" \
    --no-interaction 2>/dev/null || true

#Permisos
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

#Variables de entorno
ENV DB_CONNECTION=mysql
ENV DB_HOST=db
ENV DB_PORT=3306
ENV DB_DATABASE=martin
ENV DB_USERNAME=martin
ENV DB_PASSWORD=root
ENV QUEUE_CONNECTION=sync
ENV SESSION_DRIVER=file
ENV CACHE_STORE=file
ENV JWT_TTL=1440

#Copiar y dar permisos al script de arranque
COPY docker/start.sh /usr/local/bin/start.sh
RUN chmod +x /usr/local/bin/start.sh

EXPOSE 8000

CMD ["/usr/local/bin/start.sh"]
