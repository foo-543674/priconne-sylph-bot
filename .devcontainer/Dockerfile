FROM ubuntu:20.04

ARG USER

RUN apt update \
 && apt-get update \
# gitより先にtzdataインストールしとかないとタイムゾーン選択で止まってしまう
 && apt install -y tzdata \
 && apt install -y \
        git \
        curl \
        bash \
        openssh-client \
        ca-certificates \
        sudo \
        p7zip-full

RUN apt-get install -y \
        language-pack-ja-base \
        language-pack-ja \
        locales \
 && locale-gen ja_JP.UTF-8
ENV LANG ja_JP.UTF-8

# Environment for bot(js)
RUN apt-get update \
 && apt install -y \
        nodejs \
        npm \
 && npm install n -g \
 && n latest \
 && apt purge -y nodejs npm

# Environment for api
RUN apt-get install -y software-properties-common \
 && add-apt-repository -y ppa:ondrej/php \
 && apt update
RUN apt install -y \
        php8.0 \
        php8.0-pgsql \
        php8.0-mbstring \
        php8.0-dom \
        php8.0-zip \
        php8.0-xdebug

RUN apt update \
 && apt install -y apt-transport-https ca-certificates curl software-properties-common \
 && curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add - \
 && add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable" \
 && apt update \
 && apt install -y docker-ce

RUN curl -L https://github.com/docker/compose/releases/download/v2.2.2/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose \
 && chmod +x /usr/local/bin/docker-compose

COPY --from=composer /usr/bin/composer /usr/bin/composer

RUN adduser ${USER} \
 && echo "${USER} ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

USER ${USER}