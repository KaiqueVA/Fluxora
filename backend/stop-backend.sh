#!/bin/bash

echo "Parando container do database e do backend..."

docker compose stop db backend

echo "Container do database e do backend parados."