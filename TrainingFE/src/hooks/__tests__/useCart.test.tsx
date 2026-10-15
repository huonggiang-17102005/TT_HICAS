import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, beforeEach } from 'vitest';
import { useCart } from '../useCart.ts';
import type { IProduct } from '../../types/product.types.ts';

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

const sampleProduct: IProduct = {
  id: 101,
  title: 'Samsung Galaxy S22',
  description: 'Test description',
  category: 'smartphones',
  price: 800,
  discountPercentage: 5,
  rating: 4.2,
  stock: 20,
  thumbnail: 'https://example.com/s22.jpg',
  images: [],
};

describe('useCart hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('ban đầu giỏ hàng trống', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: createWrapper(),
    });

    expect(result.current.items).toEqual([]);
    expect(result.current.totalItemsCount).toBe(0);
    expect(result.current.subtotal).toBe(0);
    expect(result.current.total).toBe(0);
  });

  it('thêm sản phẩm vào giỏ hàng thành công', async () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.addToCart(sampleProduct, 2);
    });

    await waitFor(() => {
      expect(result.current.items.length).toBe(1);
    });

    expect(result.current.items[0].product.id).toBe(101);
    expect(result.current.items[0].quantity).toBe(2);
    expect(result.current.totalItemsCount).toBe(2);
    expect(result.current.subtotal).toBe(1600);
    expect(result.current.tax).toBe(160);
    expect(result.current.total).toBe(1760);
  });

  it('cập nhật số lượng sản phẩm', async () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.addToCart(sampleProduct, 1);
    });

    await waitFor(() => {
      expect(result.current.items.length).toBe(1);
    });

    await act(async () => {
      await result.current.updateQuantity(101, 5);
    });

    await waitFor(() => {
      expect(result.current.items[0].quantity).toBe(5);
    });

    expect(result.current.totalItemsCount).toBe(5);
    expect(result.current.subtotal).toBe(4000);
  });

  it('xóa sản phẩm khi số lượng cập nhật <= 0', async () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.addToCart(sampleProduct, 1);
    });

    await waitFor(() => {
      expect(result.current.items.length).toBe(1);
    });

    await act(async () => {
      await result.current.updateQuantity(101, 0);
    });

    await waitFor(() => {
      expect(result.current.items.length).toBe(0);
    });
    expect(result.current.totalItemsCount).toBe(0);
  });

  it('xóa sản phẩm khỏi giỏ hàng qua removeFromCart', async () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.addToCart(sampleProduct, 3);
    });

    await waitFor(() => {
      expect(result.current.items.length).toBe(1);
    });

    await act(async () => {
      await result.current.removeFromCart(101);
    });

    await waitFor(() => {
      expect(result.current.items.length).toBe(0);
    });
    expect(result.current.totalItemsCount).toBe(0);
  });

  it('xóa sạch toàn bộ giỏ hàng qua clearCart', async () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.addToCart(sampleProduct, 2);
    });

    await waitFor(() => {
      expect(result.current.items.length).toBe(1);
    });

    await act(async () => {
      await result.current.clearCart();
    });

    await waitFor(() => {
      expect(result.current.items.length).toBe(0);
    });
    expect(result.current.total).toBe(0);
  });
});
