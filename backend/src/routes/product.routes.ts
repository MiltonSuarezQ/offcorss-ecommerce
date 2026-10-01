import { Router } from 'express';

import {
  getVtexProducts,
} from '../services/vtex.service.js';

import { requireAuth } from '../middleware/auth.js';

export const productRouter = Router();

productRouter.get('/', requireAuth, async (req, res) => {
  try {
    const search =
      typeof req.query.search === 'string'
        ? req.query.search
        : undefined;

    const page =
      typeof req.query.page === 'string'
        ? Math.max(Number(req.query.page), 1)
        : 1;

    const limit =
      typeof req.query.limit === 'string'
        ? Math.min(Math.max(Number(req.query.limit), 1), 50)
        : 10;

    const result = await getVtexProducts(
      search,
      page,
      limit
    );

    res.json(result);
  } catch (error) {
    console.error('VTEX error:', error);

    res.status(502).json({
      message: 'Unable to retrieve products from VTEX',
    });
  }
});