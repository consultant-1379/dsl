#!/usr/bin/env bash
if [ "$1" == "" ] || [ "$2" == "" ]
then
    echo "No host name or port given"
    echo "Usage: listfiles.sh [HOSTNAME] [PORT]"
    exit
fi

HOST=$1
PORT=$2

bash upload_valid_zipfile.sh $HOST $PORT

sleep 5

curl "http://$HOST:$PORT/fileManager/ls/tsignum/unique"
