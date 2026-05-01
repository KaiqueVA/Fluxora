#!/bin/bash

echo "Iniciando container do frontend..."

docker compose up -d frontend

echo "Entrando no container..."

docker compose exec frontend sh