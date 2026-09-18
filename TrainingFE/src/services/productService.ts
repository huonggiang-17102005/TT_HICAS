import axiosClient from './axiosClient.ts';
import type { IProduct, IProductsResponse } from '../types/product.types.ts';

export const productService = {
  getProducts: (limit = 30, skip = 0): Promise<IProductsResponse> => {
    return axiosClient.get('/products/category/smartphones', {
      params: { limit, skip },
    });
  },

  getProductById: (id: number | string): Promise<IProduct> => {
    return axiosClient.get(`/products/${id}`);
  },

  searchProducts: (query: string): Promise<IProductsResponse> => {
    return axiosClient.get('/products/search', {
      params: { q: query },
    });
  },
};
