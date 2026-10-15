import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useProducts, useProductDetail, useSearchProducts } from '../useProducts.ts';
import { productService } from '../../services/productService.ts';
import type { IProductsResponse, IProduct } from '../../types/product.types.ts';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const mockProduct: IProduct = {
  id: 1,
  title: 'iPhone 13 Pro',
  description: 'Smart phone description',
  category: 'smartphones',
  price: 999,
  discountPercentage: 10,
  rating: 4.5,
  stock: 50,
  thumbnail: 'https://example.com/thumb.jpg',
  images: ['https://example.com/1.jpg'],
};

const mockProductsResponse: IProductsResponse = {
  products: [mockProduct],
  total: 1,
  skip: 0,
  limit: 30,
};

describe('useProducts hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useProducts', () => {
    it('lấy danh sách sản phẩm thành công', async () => {
      vi.spyOn(productService, 'getProducts').mockResolvedValue(mockProductsResponse);

      const { result } = renderHook(() => useProducts(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual([mockProduct]);
      expect(productService.getProducts).toHaveBeenCalledTimes(1);
    });

    it('xử lý lỗi khi gọi API thất bại', async () => {
      vi.spyOn(productService, 'getProducts').mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useProducts(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error?.message).toBe('Network error');
    });
  });

  describe('useProductDetail', () => {
    it('lấy chi tiết sản phẩm theo id thành công', async () => {
      vi.spyOn(productService, 'getProductById').mockResolvedValue(mockProduct);

      const { result } = renderHook(() => useProductDetail(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockProduct);
      expect(productService.getProductById).toHaveBeenCalledWith(1);
    });
  });

  describe('useSearchProducts', () => {
    it('tìm kiếm sản phẩm với từ khóa', async () => {
      vi.spyOn(productService, 'searchProducts').mockResolvedValue(mockProductsResponse);

      const { result } = renderHook(() => useSearchProducts('iphone'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual([mockProduct]);
      expect(productService.searchProducts).toHaveBeenCalledWith('iphone');
    });

    it('không gọi API khi từ khóa rỗng', () => {
      const spy = vi.spyOn(productService, 'searchProducts');

      const { result } = renderHook(() => useSearchProducts('   '), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(spy).not.toHaveBeenCalled();
    });
  });
});
