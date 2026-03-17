#!/bin/bash

echo "Iniciando container do backend..."

docker compose up -d db backend

echo "Container do backend iniciado. Acessando o terminal do container..."

docker compose exec backend bash