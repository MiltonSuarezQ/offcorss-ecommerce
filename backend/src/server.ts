import express from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import { env, validateEnv } from './config/env.js';
import { connectDatabase } from './config/database.js';
import { authRouter } from './routes/auth.routes.js';
import { productRouter } from './routes/product.routes.js';
import { typeDefs, resolvers } from './graphql/schema.js';
import { verifyToken } from './utils/auth.js';

validateEnv();
await connectDatabase();

const app = express();
const apollo = new ApolloServer({ typeDefs, resolvers });
await apollo.start();

app.use(cors({ origin: env.frontendUrl }));
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRouter);
app.use('/api/products', productRouter);
app.use(
  '/graphql',
  expressMiddleware(apollo, {
    context: async ({ req }) => {
      const authorization = req.headers.authorization;

      if (!authorization) {
        return {};
      }

      const token = authorization.startsWith('Bearer ')
        ? authorization.substring(7)
        : authorization;

      try {
        const decoded = verifyToken(token);

        return {
          userId: decoded.userId,
          username: decoded.username,
        };
      } catch {
        return {};
      }
    },
  })
);

app.listen(env.port, () => {
  console.log(`Backend running on http://localhost:${env.port}`);
  console.log(`GraphQL available on http://localhost:${env.port}/graphql`);
});
