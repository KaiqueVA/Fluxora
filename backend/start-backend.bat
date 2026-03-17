@echo off

echo Iniciando container do backend...

docker compose up -d db backend

echo Entrando no container...

docker compose exec backend bash