#!/usr/bin/env bash
if [ "$1" == "" ] || [ "$2" == "" ]
then
    echo "No host name or port given"
    echo "Usage: upload_invalid_file.sh [HOSTNAME] [PORT]"
    exit
fi

HOST=$1
PORT=$2

curl -X POST "http://$HOST:$PORT/fileManager/mkdir" -d @create_dir.json -H "Content-Type: application/json"
curl -F "file=@testinvalid.txt" "http://$HOST:$PORT/project/upload/tsignum/unique"
