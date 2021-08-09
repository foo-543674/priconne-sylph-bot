FROM ubuntu:20.04

RUN apt update \
# gitより先にtzdataインストールしとかないとタイムゾーン選択で止まってしまう
 && apt install -y tzdata \
 && apt install -y \
        git \
        curl \
        bash \
        openssh-client \
        ca-certificates \
        sudo

RUN apt install language-pack-ja \
 && export LANG=ja_JP.UTF-8
 && export LANGUAGE=ja_JP:

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
        php8.0-pgsql

COPY --from=composer /usr/bin/composer /usr/bin/composer
