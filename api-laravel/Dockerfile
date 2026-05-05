FROM php:8.4-cli-alpine

RUN apk add --no-cache \
    bash \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    libxml2-dev \
    libzip-dev \
    oniguruma-dev \
    libsodium-dev \
    zip \
    unzip \
    git \
    curl \
    mysql-client \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) gd pdo_mysql sodium pcntl mbstring xml dom zip

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY composer.json composer.lock ./
RUN composer install \
    --no-interaction \
    --no-scripts \
    --no-autoloader \
    --prefer-dist \
    --no-dev

COPY . .

RUN composer dump-autoload --optimize --classmap-authoritative

RUN cp .env.example .env

RUN mkdir -p storage/framework/cache/data \
        storage/framework/sessions \
        storage/framework/views \
        storage/logs \
        bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

ENV DB_CONNECTION=mysql \
    DB_HOST=db \
    DB_PORT=3306 \
    DB_DATABASE=martin \
    DB_USERNAME=martin \
    DB_PASSWORD=root \
    QUEUE_CONNECTION=sync \
    SESSION_DRIVER=file \
    CACHE_STORE=file \
    JWT_TTL=1440

COPY docker/start.sh /usr/local/bin/start.sh
RUN sed -i 's/\r//' /usr/local/bin/start.sh \
    && chmod +x /usr/local/bin/start.sh

EXPOSE 8000
CMD ["/usr/local/bin/start.sh"]
