import axios from 'axios';

import { env } from '../config/env.js';

interface VtexImage {
  imageUrl: string;
  imageText?: string;
}

interface VtexItem {
  itemId: string;
  name?: string;
  images?: VtexImage[];
  sellers?: unknown[];
}

interface VtexProduct {
  productId: string;
  productName: string;
  brand: string;
  brandId?: number;
  linkText?: string;
  categories?: string[];
  items?: VtexItem[];
}

export interface Product {
  productId: string;
  brand: string;
  productTitle: string;
  items: {
    itemId: string;
  }[];
  images: {
    imageUrl: string;
    imageText?: string;
  }[];
  linkText?: string;
  categories: string[];
}

export interface ProductsResult {
  products: Product[];
  page: number;
  limit: number;
  total: number;
  hasNextPage: boolean;
}

export async function getVtexProducts(
  search?: string,
  page = 1,
  limit = 10
): Promise<ProductsResult> {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const response = await axios.get<VtexProduct[]>(
    env.vtexProductsUrl,
    {
      params: {
        ...(search ? { ft: search } : {}),
        _from: from,
        _to: to,
      },
      timeout: 10000,
      headers: {
        Accept: 'application/json',
      },
    }
  );

  const products = response.data.map((product) => ({
    productId: product.productId,
    brand: product.brand,
    productTitle: product.productName,
    items: (product.items ?? []).map((item) => ({
      itemId: item.itemId,
    })),
    images: (product.items ?? [])
      .flatMap((item) => item.images ?? [])
      .filter(
        (image, index, images) =>
          images.findIndex(
            (img) => img.imageUrl === image.imageUrl
          ) === index
      ),
    linkText: product.linkText,
    categories: product.categories ?? [],
  }));

  /*
   * VTEX devuelve el total en el header:
   * resources: 0-9/248
   */
  const resourcesHeader = response.headers['resources'];

  let total = products.length;

  if (typeof resourcesHeader === 'string') {
    const match = resourcesHeader.match(/\/(\d+)$/);

    if (match) {
      total = Number(match[1]);
    }
  }

  return {
    products,
    page,
    limit,
    total,
    hasNextPage: to + 1 < total,
  };
}