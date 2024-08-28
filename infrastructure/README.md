# DSL Docker Compose

This folder contains a Docker compose file to bootstrap a new DSL server (frontend and backend services).

## Install

1. Init submodules:

In root of this repository:

```
# git submodule init
# git submodule update
```

## Configuration

A `.env` file must be created in the infrastructure directory. It should look like this:

```
DSL_DATA=[PATH TO DATA DIRECTORY]
GITLAB_URL=[SERVER URL]
BACKEND_URL=[BACKEND URL]
COUCHDB_URL=[COUCH DB URL]
LDAP_PASSWORD=[LDAP PASSWORD]
```

Do not include ports in the URLs

## Single Command Deployment 

Run `./scripts/deploy` from the root of the repository.

## Manual deployment

You may manually deploy DSL by executing the following commands from the root of the repository.

```
cd backend
npx npm run clean
rm -rf node_modules
npx npm install
npx npm run build production
cd ../frontend
rm -rf dist node_modules
npx npm install
npx ng build -c production
cd ../infrastructure
docker-compose down
docker-compose up -d --build
```

