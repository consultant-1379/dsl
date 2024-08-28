#!/usr/bin/env bash
if [ "$1" == "" ] || [ "$2" == "" ]
then
    echo "No host name or port given"
    echo "Usage: cancel.sh [HOSTNAME] [PORT]"
    exit
fi

HOST=$1
PORT=$2

curl -X POST "http://$HOST:$PORT/fileManager/mkdir/" -d @delete_test_1.json -H "Content-Type: application/json"
curl -X POST "http://$HOST:$PORT/fileManager/mkdir/" -d @delete_test_2.json -H "Content-Type: application/json"
curl -X POST "http://$HOST:$PORT/fileManager/mkdir/" -d @delete_test_3.json -H "Content-Type: application/json"

sleep 2
echo "ls ../tmp/tsignum"
ls ../tmp/tsignum

curl "http://$HOST:$PORT/project/cancel/tsignum"

sleep 2

echo "ls ../tmp/tsignum: "
ls ../tmp/tsignum
