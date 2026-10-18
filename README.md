# Base de datos — Taller API de Personajes Marvel
Juan Jose Penha
Santiago Pinilla 

Este repositorio **solo** contiene la base de datos PostgreSQL con datos de prueba.
El proyecto NestJS lo deben crear ustedes desde cero, en una carpeta aparte.

## Requisitos
- Docker Desktop (o Docker Engine + Docker Compose)

## Levantar la base de datos
```bash
docker compose up -d
```
La primera vez se crean las tablas `teams` y `characters` y se cargan los datos iniciales.

## Datos de conexión
| Dato       | Valor       |
|------------|-------------|
| Host       | localhost   |
| Puerto     | 5433        |
| Usuario    | marvel      |
| Contraseña | marvel123   |
| Base       | marvel_db   |

(Se usa el puerto 5433 para no chocar con un PostgreSQL que ya tengan instalado.)

## Comandos útiles
```bash
docker compose ps          # ver si está corriendo
docker compose logs -f     # ver logs
docker compose down        # apagar (los datos se conservan)
docker compose down -v     # apagar y BORRAR datos (al subir de nuevo se recargan los iniciales)
docker exec -it marvel_db psql -U marvel -d marvel_db   # consola SQL
```
