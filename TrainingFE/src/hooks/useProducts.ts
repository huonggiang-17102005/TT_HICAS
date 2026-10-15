import { useQuery } from '@tanstack/react-query';
import { productService } from '../services/productService.ts';
import type { IProduct, IProductsResponse } from '../types/product.types.ts';

export const useProducts = (limit = 30, skip = 0) => {
  return useQuery<IProductsResponse, Error, IProduct[]>({
    queryKey: ['products', { limit, skip }],
    queryFn: () => productService.getProducts(limit, skip),
    select: (data) => data.products,
  });
};

export const useProductDetail = (id: number | string) => {
  return useQuery<IProduct, Error>({
    queryKey: ['product', id],
    queryFn: () => productService.getProductById(id),
    enabled: Boolean(id),
  });
};

export const useSearchProducts = (query: string) => {
  const cleanQuery = query.trim();
  return useQuery<IProductsResponse, Error, IProduct[]>({
    queryKey: ['products', 'search', cleanQuery],
    queryFn: () => productService.searchProducts(cleanQuery),
    enabled: cleanQuery.length > 0,
    select: (data) => data.products,
  });
};
