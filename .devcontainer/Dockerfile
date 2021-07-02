FROM python:3.8.11-alpine3.14

ARG USER
ARG HOME

RUN apk add --update --no-cache \
        git \
        curl \
        bash \
        openssh-client \
        ca-certificates \
        su-exec

RUN adduser -S ${USER} -h ${HOME} \
 && echo "${USER} ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

USER ${USER}