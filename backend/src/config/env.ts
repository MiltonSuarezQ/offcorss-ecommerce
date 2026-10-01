import 'dotenv/config';

export const env = {
  port: Number(process.env.PORT ?? 4000),
  mongodbUri: process.env.MONGODB_URI ?? '',
  jwtSecret: process.env.JWT_SECRET ?? '',
  vtexProductsUrl:
    process.env.VTEX_PRODUCTS_URL ??
    'https://offcorss.myvtex.com/api/catalog_system/pub/products/search/',
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:5173',
};

export function validateEnv(): void {
  if (!env.mongodbUri) throw new Error('MONGODB_URI is required');
  if (!env.jwtSecret) throw new Error('JWT_SECRET is required');
}
