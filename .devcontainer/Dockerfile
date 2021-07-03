FROM python:3.8.11-alpine3.14

ARG USER
ARG HOME

RUN apk add --update --no-cache \
        git \
        curl \
        bash \
        openssh-client \
        ca-certificates \
        sudo

RUN apk add --no-cache \
        gcc \
        musl-dev \
 && pip3 install -U discord.py


RUN adduser -S ${USER} -h ${HOME} \
 && echo "${USER} ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

USER ${USER}