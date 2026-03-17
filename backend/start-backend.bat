@echo off

echo Iniciando container do backend...

docker compose up -d backend

echo Entrando no container...

docker compose exec backend bash