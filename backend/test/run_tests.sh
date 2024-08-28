#!/usr/bin/env bash
if [ "$1" == "" ] || [ "$2" == "" ]
then
    echo "No host name or port given"
    echo "Usage: run_tests.sh [HOSTNAME] [PORT]"
    exit
fi

HOST=$1
PORT=$2

echo "Running cancel project creation test"
bash cancel.sh $HOST $PORT
echo "Running publish project test"
bash publish.sh $HOST $PORT
echo "Running listfiles test"
bash listfiles.sh $HOST $PORT
echo "Running upload invalid file test"
bash upload_invalid_file.sh $HOST $PORT
echo "Running upload valid file test"
bash upload_valid_zipfile.sh $HOST $PORT
echo "Done"
