import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export interface Product {
  productId: string;
  brand: string;
  productTitle: string;
  items: { itemId: string }[];
  images: { imageUrl: string; imageText?: string }[];
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

export async function getProducts(
  search?: string,
  page = 1,
  limit = 10
): Promise<ProductsResult> {
  const token = localStorage.getItem('token');

  const response = await axios.get<ProductsResult>(
    `${API_URL}/api/products`,
    {
      params: {
        ...(search ? { search } : {}),
        page,
        limit,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}