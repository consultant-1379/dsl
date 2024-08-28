#! /usr/bin/env bash

echo "Waiting for GitLab token..."
while [ ! -f /tmp/backend/production.env ]
do
  sleep 5;
done

echo "Config file with token recieved. Copying..."

cp /tmp/backend/production.env /usr/app

echo "Starting backend."

sh -c "npm start"
