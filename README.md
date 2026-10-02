# OFFCORSS E-commerce Platform

Plataforma web desarrollada como solución para la prueba técnica de **Coordinador(a) de Plataformas E-commerce**.

La solución integra un frontend en React + TypeScript, un backend en Node.js/Express, MongoDB Atlas, GraphQL, autenticación mediante JWT y consumo de productos desde la API pública de VTEX.

## Demo

- **Frontend:** https://miltonsuarezq.github.io/offcorss-ecommerce/
- **Backend:** https://offcorss-backend-16uw.onrender.com
- **Health check:** https://offcorss-backend-16uw.onrender.com/health
- **GraphQL:** https://offcorss-backend-16uw.onrender.com/graphql

## Funcionalidades

### Autenticación

- Login contra la base de datos.
- Autenticación mediante JWT.
- Validaciones del formulario.
- Mostrar/ocultar contraseña.
- Manejo de credenciales incorrectas.
- Protección de endpoints.
- Cierre de sesión y limpieza de sesión.

### Dashboard

- Resumen de la plataforma.
- Acceso a módulos principales.
- Visualización de productos recientes.
- Diseño responsive.

### Productos

- Consumo de productos desde VTEX mediante el backend.
- Búsqueda por producto.
- Paginación.
- Selección individual y múltiple.
- Exportación de productos seleccionados a CSV.
- Vista detallada del producto.
- Galería de imágenes.
- Navegación entre imágenes.
- Efecto de zoom.
- Impresión del detalle.

### Perfil

- Consulta del usuario autenticado.
- Edición de nombre, apellido y correo.
- Persistencia de cambios en MongoDB.
- Mensajes de éxito y error.
- Validaciones de formulario.

## Arquitectura

```text
                    ┌─────────────────────────┐
                    │       GitHub Pages       │
                    │   React + TypeScript     │
                    │       Vite + CSS        │
                    └────────────┬────────────┘
                                 │ HTTPS / REST / GraphQL
                                 ▼
                    ┌─────────────────────────┐
                    │          Render          │
                    │     Node.js + Express   │
                    │        Apollo GraphQL   │
                    │          JWT             │
                    └───────┬─────────┬───────┘
                            │         │
                  ┌─────────┘         └─────────────┐
                  ▼                                 ▼
        ┌───────────────────┐             ┌───────────────────┐
        │    MongoDB Atlas  │             │    API pública    │
        │      Usuarios     │             │       VTEX        │
        └───────────────────┘             └───────────────────┘
```

## Tecnologías

### Frontend

- React
- TypeScript
- Vite
- Axios
- React Router
- CSS responsive
- ESLint

### Backend

- Node.js
- Express
- TypeScript
- Apollo Server
- GraphQL
- JSON Web Token (JWT)
- Axios
- MongoDB / MongoDB Atlas

### Integraciones

- VTEX Catalog API
- MongoDB Atlas
- GitHub Pages
- Render

## Estructura del proyecto

```text
offcorss-ecommerce/
├── .github/
│   └── workflows/
│       └── deploy-frontend.yml
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── graphql/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── server.ts
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── styles.css
│   ├── .env.example
│   ├── package.json
│   └── vite.config.ts
├── .gitignore
└── README.md
```

## Requisitos

- Node.js 24+
- npm
- MongoDB Atlas o una instancia compatible de MongoDB
- Cuenta de VTEX para utilizar un endpoint de catálogo compatible, si se requiere cambiar el endpoint configurado.

## Instalación local

Clonar el repositorio:

```bash
git clone https://github.com/MiltonSuarezQ/offcorss-ecommerce.git
cd offcorss-ecommerce
```

### Backend

```bash
cd backend
npm install
```

Crear `.env` a partir de `.env.example`:

```env
PORT=4000
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@HOST/DATABASE
JWT_SECRET=CHANGE_ME
FRONTEND_URL=http://localhost:5173
VTEX_PRODUCTS_URL=https://offcorss.myvtex.com/api/catalog_system/pub/products/search/
```

Iniciar en desarrollo:

```bash
npm run dev
```

Crear build de producción:

```bash
npm run build
```

Iniciar producción:

```bash
npm start
```

### Frontend

En otra terminal:

```bash
cd frontend
npm install
```

Crear `.env`:

```env
VITE_API_URL=http://localhost:4000
```

Iniciar en desarrollo:

```bash
npm run dev
```

Build de producción:

```bash
npm run build
```

Validar código:

```bash
npm run lint
```

## Variables de entorno

### Backend

| Variable | Descripción |
|---|---|
| `PORT` | Puerto utilizado por el servidor. |
| `MONGODB_URI` | Cadena de conexión a MongoDB. |
| `JWT_SECRET` | Clave utilizada para firmar y validar JWT. |
| `FRONTEND_URL` | Origin permitido para CORS. |
| `VTEX_PRODUCTS_URL` | Endpoint de productos de VTEX. |

### Frontend

| Variable | Descripción |
|---|---|
| `VITE_API_URL` | URL base del backend. |

> Los archivos `.env` no se incluyen en el repositorio. Utilizar `.env.example` como referencia.

## API

### REST

#### Health check

```http
GET /health
```

Respuesta esperada:

```json
{
  "status": "ok"
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json
```

Ejemplo de body:

```json
{
  "username": "admin",
  "password": "TU_CONTRASEÑA"
}
```

El endpoint devuelve un JWT y la información del usuario autenticado.

#### Productos

```http
GET /api/products
Authorization: Bearer <JWT>
```

Soporta parámetros de búsqueda y paginación utilizados por el frontend.

## GraphQL

Endpoint:

```text
/graphql
```

La API GraphQL utiliza autenticación mediante JWT para las operaciones protegidas.

Operaciones principales:

- `me`
- `user`
- `updateUser`

Ejemplo:

```graphql
query {
  me {
    id
    username
    name
    lastName
    email
    userType
    createDate
  }
}
```

Enviar el token mediante:

```http
Authorization: Bearer <JWT>
```

## Seguridad

- Credenciales y secretos mediante variables de entorno.
- JWT para autenticación.
- Middleware de autorización para endpoints protegidos.
- CORS configurado mediante `FRONTEND_URL`.
- `.env` excluido mediante `.gitignore`.
- Validaciones en frontend y backend.

## Despliegue

### Backend - Render

Configuración utilizada:

```text
Root Directory: backend
Build Command: npm install && npm run build
Start Command: npm start
```

### Frontend - GitHub Pages

El frontend se despliega mediante GitHub Actions.

Workflow:

```text
.github/workflows/deploy-frontend.yml
```

El proyecto utiliza la siguiente configuración de Vite para funcionar bajo el repositorio de GitHub Pages:

```ts
base: '/offcorss-ecommerce/'
```

Cada cambio en `main` que afecte al frontend puede ejecutar el workflow de despliegue.

## Calidad y buenas prácticas

- TypeScript para tipado estático.
- ESLint para validación del código.
- Componentes y servicios separados por responsabilidad.
- Variables sensibles fuera del repositorio.
- Formularios con validaciones y mensajes de error.
- HTML semántico y atributos ARIA cuando corresponde.
- Diseño responsive para escritorio y dispositivos móviles.
- Estados de carga, error y éxito en las principales operaciones.
- Build de producción validado antes del despliegue.

## Estado del proyecto

Proyecto desplegado y funcional en producción.

- Frontend: GitHub Pages
- Backend: Render
- Base de datos: MongoDB Atlas
- Catálogo: VTEX
