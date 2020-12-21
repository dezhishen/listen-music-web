FROM nginx:stable-alpine
LABEL Dockerfile="shendezhi@umxwe.com"
RUN apk add --repository  https://mirrors.aliyun.com/alpine/v3.4/main/ --update curl && rm -rf /var/cache/apk/*
COPY nginx.conf /etc/nginx/nginx.conf
COPY /dist /usr/share/nginx/html/