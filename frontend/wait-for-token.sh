#! /usr/bin/env bash

echo "Waiting for GitLab token..."
while [ ! -f /usr/share/nginx/html/assets/config/production.json ]
do
  sleep 5;
done

echo "Config file with token recieved. Starting nginx."

sh -c "nginx -g 'daemon off;'"
