FROM docker.io/nginx:stable-alpine
ENV PORT 8080
COPY dist/apps/web/* /usr/share/nginx/html/
COPY apps/web/nginx.conf /etc/nginx/conf.d/configfile.template
RUN sh -c "envsubst '\$PORT' < /etc/nginx/conf.d/configfile.template > /etc/nginx/conf.d/default.conf"
CMD ["nginx", "-g", "daemon off;"]
