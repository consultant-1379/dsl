#!/usr/bin/env bash
if [ "$1" == "" ] || [ "$2" == "" ]
then
    echo "No host name or port given"
    echo "Usage: publish.sh [HOSTNAME] [PORT]"
    exit
fi

HOST=$1
PORT=$2

bash upload_valid_zipfile.sh $HOST $PORT &&
curl -X POST "http://$HOST:$PORT/project/publish/tsignum/unique/my-fancy-project" -d @test_publish.json -H "Content-Type: application/json"
