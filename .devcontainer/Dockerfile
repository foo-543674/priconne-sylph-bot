FROM ubuntu:20.04

ARG USER

RUN apt update \
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

# Environment for bot
RUN apt install -y python3-pip \
 && python3 -m pip install -U discord.py \
 && pip3 install pyyaml

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

COPY --from=composer /usr/bin/composer /usr/bin/composer

RUN adduser ${USER} \
 && echo "${USER} ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

USER ${USER}