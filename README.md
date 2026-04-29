# Proyecto 2 - Tienda de Instrumentos Musicales y Equipo de Audio

## Descripción del proyecto
Este proyecto consiste en el desarrollo de una aplicación web para gestionar el inventario y las ventas de una tienda de instrumentos musicales y equipo de audio.
El sistema permite administrar productos, clientes, ventas y reportes, utilizando una base de datos relacional en PostgreSQL, un backend en Node.js con Express y una interfaz web en HTML, CSS y JavaScript.
La aplicación cumple con los requerimientos del proyecto al incluir:
- Base de datos relacional
- SQL explícito
- CRUD de productos
- CRUD de clientes
- Registro de ventas con transacción
- Reportes visibles en la interfaz
- Uso de Docker Compose para levantar toda la infraestructura
## Tecnologías utilizadas
- PostgreSQL 16
- Node.js
- Express
- HTML
- CSS
- JavaScript
- Docker
- Docker Compose
## Estructura del proyecto
```text
proyecto2-tienda-musical/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   ├── productos.controller.js
│   │   │   ├── clientes.controller.js
│   │   │   ├── ventas.controller.js
│   │   │   └── reportes.controller.js
│   │   ├── routes/
│   │   │   ├── productos.routes.js
│   │   │   ├── clientes.routes.js
│   │   │   ├── ventas.routes.js
│   │   │   └── reportes.routes.js
│   │   ├── public/
│   │   │   ├── css/
│   │   │   │   └── styles.css
│   │   │   └── js/
│   │   │       ├── app.js
│   │   │       ├── productos.js
│   │   │       ├── clientes.js
│   │   │       ├── ventas.js
│   │   │       └── reportes.js
│   │   ├── views/
│   │   │   ├── index.html
│   │   │   ├── productos.html
│   │   │   ├── clientes.html
│   │   │   ├── ventas.html
│   │   │   └── reportes.html
│   │   └── app.js
│   ├── Dockerfile
│   ├── .dockerignore
│   └── package.json
│
├── database/
│   ├── 01_ddl.sql
│   ├── 02_inserts.sql
│   ├── 03_indices.sql
│   ├── 04_view.sql
│   └── consultas_prueba.sql
│
├── docker-compose.yml
├── .env
├── .env.example
└── README.md
```

## Variables de entorno

El proyecto utiliza variables de entorno definidas en un archivo .env.

## Contenido de .env.example

PORT=3000
DB_HOST=db
DB_PORT=5432
DB_NAME=tienda_musical
DB_USER=proy2
DB_PASSWORD=secret
POSTGRES_DB=tienda_musical
POSTGRES_USER=proy2
POSTGRES_PASSWORD=secret

## Credenciales de base de datos

De acuerdo con las instrucciones del proyecto, las credenciales utilizadas son:

* Usuario: proy2
* Contraseña: secret

## Cómo ejecutar el proyecto

1. Clonar el repositorio

git clone https://github.com/K41S3RTK1/proyecto2-tienda-musical.git
cd proyecto2-tienda-musical

2. Crear el archivo .env

Copia el archivo .env.example y crea tu .env:

cp .env.example .env

3. Levantar el proyecto con Docker Compose

docker compose up --build

Si deseas reiniciar completamente la base de datos y volver a ejecutar los scripts SQL desde cero, puedes usar:

docker compose down -v
docker compose up --build

## Qué hace Docker al iniciar

Cuando se ejecuta docker compose up --build, se levantan dos servicios:

* db: contenedor PostgreSQL
* backend: contenedor Node.js con Express

Además, PostgreSQL ejecuta automáticamente los siguientes archivos SQL:

* 01_ddl.sql: creación de tablas
* 02_inserts.sql: inserción de datos de prueba
* 03_indices.sql: creación de índices
* 04_view.sql: creación de la vista vista_reporte_ventas

URL principal de la aplicación

Una vez levantado el proyecto, la aplicación estará disponible en:

http://localhost:3000

## Rutas principales de la aplicación

Interfaz web

* / → página principal
* /productos-page → gestión de productos
* /clientes-page → gestión de clientes
* /ventas-page → registro de ventas
* /reportes-page → reportes del sistema

Ruta de prueba

* /test-db → prueba de conexión entre backend y PostgreSQL

## Funcionalidades implementadas

1. CRUD de productos

Permite:

* listar productos
* crear productos
* editar productos
* eliminar productos

2. CRUD de clientes

Permite:

* listar clientes
* crear clientes
* editar clientes
* eliminar clientes

3. Registro de ventas

Permite registrar una venta con:

* cliente
* empleado
* producto
* cantidad
* método de pago

El registro de la venta utiliza una transacción explícita para:

* insertar en venta
* insertar en detalle_venta
* actualizar el stock del producto
* aplicar ROLLBACK si ocurre un error

4. Reportes visibles

La interfaz incluye reportes que muestran:

* ventas por categoría
* productos más vendidos
* ventas mayores al promedio
* reporte basado en una VIEW

## Consultas SQL implementadas

El proyecto incluye consultas SQL visibles en la aplicación web.

JOIN

* productos con categoría y proveedor
* ventas con cliente y empleado
* detalle de venta con producto y venta

Subqueries

* productos vendidos al menos una vez
* ventas mayores al promedio

GROUP BY / HAVING / agregaciones

* total vendido por categoría
* productos más vendidos

CTE

* resumen de productos vendidos

VIEW

* vista_reporte_ventas

Transacción

* registro de venta con actualización de stock

## Datos de prueba

La base de datos incluye datos de prueba realistas para todas las tablas principales:

* categoria
* proveedor
* cliente
* empleado
* producto
* venta
* detalle_venta

Se insertaron 25 registros por tabla, según lo requerido por el proyecto.
