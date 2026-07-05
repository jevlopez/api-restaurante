# API Restaurante

API REST para gestionar mesas y reservaciones de un restaurante con autenticación JWT y documentación Swagger.

## 🧩 Tecnologías

- Node.js
- Express
- Prisma (PostgreSQL)
- JWT (`jsonwebtoken`)
- Bcrypt (`bcryptjs`)
- Swagger UI (`swagger-ui-express`, `swagger-jsdoc`)
- CORS
- dotenv

## 🚀 Instalación

1. Clona el proyecto o descarga el código.
2. Instala dependencias:

```bash
npm install
```

3. Configura el archivo `.env` en la raíz del proyecto con al menos estas variables:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/tu_basedatos
JWT_SECRET=tu_secreto_jwt
PORT=3000
```

4. Genera el cliente de Prisma y crea/actualiza la base de datos:

```bash
npm run build
npm run db:push
```

O si usas migraciones:

```bash
npm run migrate
```

## ▶️ Ejecución

Inicia el servidor:

```bash
npm start
```

El servicio se ejecuta por defecto en:

- `http://localhost:3000`

## 📚 Documentación Swagger

Accede a la documentación Swagger UI en:

- `http://localhost:3000/api-docs/`

## 🔐 Endpoints principales

### Auth

- `POST /api/auth/register`
  - Registra un usuario.
  - Body:
    - `nombre` (string)
    - `correo` (string)
    - `password` (string)

- `POST /api/auth/login`
  - Inicia sesión y devuelve token JWT.
  - Body:
    - `correo` (string)
    - `password` (string)

### Mesas

Todos los endpoints de mesas requieren token JWT en `Authorization: Bearer <token>`.

- `POST /api/mesas`
  - Crear mesa.
  - Body:
    - `numero` (integer)
    - `capacidad` (integer)
    - `disponible` (boolean)

- `GET /api/mesas`
  - Listar mesas.

- `GET /api/mesas/:id`
  - Obtener mesa por ID.

- `PUT /api/mesas/:id`
  - Actualizar mesa.
  - Body opcional: `numero`, `capacidad`, `disponible`.

- `DELETE /api/mesas/:id`
  - Eliminar mesa.

### Reservaciones

Todos los endpoints de reservaciones requieren token JWT en `Authorization: Bearer <token>`.

- `POST /api/reservaciones`
  - Crear reservación.
  - Body:
    - `mesa_id` (integer)
    - `fecha` (string, formato fecha)
    - `hora` (string)
    - `personas` (integer)

- `DELETE /api/reservaciones/:id`
  - Eliminar reservación.

## 🧪 Pruebas de API

Hay un script de prueba básico en `test_endpoints.js`.

Ejecutar:

```bash
npm test
```

## 📁 Estructura principal

- `app.js` - Configura Express, rutas y Swagger.
- `routes/` - Definición de rutas.
- `controllers/` - Lógica de controladores.
- `middleware/auth.js` - Verificación JWT.
- `config/prisma.js` - Cliente Prisma.
- `prisma/` - Esquema Prisma.

## ⚠️ Notas

- El token JWT debe enviarse en el header `Authorization`.
- `/api-docs/` es la ruta válida para Swagger UI.
- Asegúrate de tener PostgreSQL activo y `DATABASE_URL` correcto.
