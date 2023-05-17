#!/bin/bash
printf "Importing Environment Variables...\n"
set -a; source .env; set +a

printf "Up containers\n"
docker compose -f ./docker-compose.yaml --env-file ./.env up --remove-orphans -d