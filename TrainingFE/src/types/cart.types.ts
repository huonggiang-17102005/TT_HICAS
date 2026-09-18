import type { IProduct } from './product.types.ts';

export interface ICartItem {
  product: IProduct;
  quantity: number;
}

export interface ICartState {
  items: ICartItem[];
  subtotal: number;
  tax: number;
  total: number;
}
