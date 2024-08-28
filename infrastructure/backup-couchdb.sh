#! /usr/bin/env bash

# Couch DB backup script for DSL
#
# Author: alanna.kelly@ericsson.com
#
#
#

COUCH_DB_PATH="/opt/couchdb"
COUCH_DB_DATA_PATH="$COUCH_DB_PATH/data"
COUCH_DB_CONF_PATH="$COUCH_DB_PATH/etc"
COUCH_DB_BACKUP_PATH="$COUCH_DB_PATH/backup"
TAR_XZ_CMD="tar cJf "
TIME_STAMP=$(date +%Y%m%d-%H%M)
ARCHIVE_NAME="$COUCH_DB_BACKUP_PATH/couch-db-backup-$TIME_STAMP.tar.xz"

$TAR_XZ_CMD $ARCHIVE_NAME $COUCH_DB_DATA_PATH $COUCH_DB_CONF_PATH

logger -s "CouchDB backed up to $ARCHIVE_NAME at $(date)."


