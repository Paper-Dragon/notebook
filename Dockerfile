FROM nginx

LABEL org.opencontainers.image.authors="<Paper-Dragon 2678885646@qq.com>"
ENV TZ=Asia/Shanghai

ADD ./file /usr/share/nginx/html