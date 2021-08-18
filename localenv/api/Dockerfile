FROM php:8.0-fpm-alpine

RUN apk --no-cache add \
        postgresql-dev \
        oniguruma-dev \
        libxml2-dev \
        libzip-dev
RUN docker-php-ext-install \
        pdo \
        pdo_pgsql\
        mbstring \
        dom \
        zip 

COPY localenv/api/conf/zzz-docker.conf /usr/local/etc/php-fpm.d/zzz-docker.conf
COPY localenv/api/conf/php.ini /usr/local/etc/php/conf.d/app-php.ini
COPY api /var/www

RUN chown -R /var/www