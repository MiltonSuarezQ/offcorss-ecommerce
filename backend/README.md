# OFFCORSS - Coordinador de Plataformas E-commerce

Prueba técnica: aplicación para autenticación, perfil de usuario y consulta de productos del catálogo VTEX de OFFCORSS.

## Stack

- React + TypeScript (frontend)
- Node.js + Express + TypeScript (backend)
- MongoDB
- GraphQL
- JWT + bcrypt
- Axios

## Backend local

1. Copiar `.env.example` a `.env`.
2. Configurar `MONGODB_URI` y `JWT_SECRET`.
3. Instalar dependencias:

```bash
npm install
```

4. Crear usuario de prueba:

```bash
npm run seed
```

Usuario: `admin`
Password: `Admin123*`

5. Ejecutar:

```bash
npm run dev
```

## Endpoints

- `GET /health`
- `POST /api/auth/login`
- `GET /api/products`
- `POST /graphql`

## Arquitectura

El frontend no consume directamente VTEX. El backend actúa como capa de integración, centralizando autenticación, manejo de errores y transformación de datos.

GraphQL se utiliza para el acceso a la información persistente de usuarios y las mutaciones de actualización.
