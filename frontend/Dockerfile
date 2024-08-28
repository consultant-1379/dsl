FROM nginx
ADD dist/dsl /usr/share/nginx/html
ADD docker.nginx.conf /etc/nginx/conf.d/default.conf
ADD wait-for-token.sh /tmp/wait-for-token.sh
EXPOSE 80
ENTRYPOINT ["./tmp/wait-for-token.sh"]


