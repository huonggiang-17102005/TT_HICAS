import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ICartItem, ICartState } from '../types/cart.types.ts';
import type { IProduct } from '../types/product.types.ts';

const calculateTotals = (items: ICartItem[]) => {
  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;
  return { subtotal, tax, total };
};

const saveToLocalStorage = (items: ICartItem[]) => {
  try {
    localStorage.setItem('cart_items', JSON.stringify(items));
  } catch {
    // ignore
  }
};

const loadInitialState = (): ICartState => {
  try {
    const saved = localStorage.getItem('cart_items');
    if (saved) {
      const items: ICartItem[] = JSON.parse(saved);
      const { subtotal, tax, total } = calculateTotals(items);
      return { items, subtotal, tax, total };
    }
  } catch {
    // ignore
  }
  return { items: [], subtotal: 0, tax: 0, total: 0 };
};

const initialState: ICartState = loadInitialState();

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ product: IProduct; quantity?: number }>) => {
      const { product, quantity = 1 } = action.payload;
      const existingIndex = state.items.findIndex((item) => item.product.id === product.id);

      if (existingIndex > -1) {
        state.items[existingIndex].quantity += quantity;
      } else {
        state.items.push({ product, quantity });
      }

      const computed = calculateTotals(state.items);
      state.subtotal = computed.subtotal;
      state.tax = computed.tax;
      state.total = computed.total;
      saveToLocalStorage(state.items);
    },

    updateQuantity: (state, action: PayloadAction<{ productId: number; quantity: number }>) => {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        state.items = state.items.filter((item) => item.product.id !== productId);
      } else {
        const item = state.items.find((item) => item.product.id === productId);
        if (item) {
          item.quantity = quantity;
        }
      }

      const computed = calculateTotals(state.items);
      state.subtotal = computed.subtotal;
      state.tax = computed.tax;
      state.total = computed.total;
      saveToLocalStorage(state.items);
    },

    removeFromCart: (state, action: PayloadAction<number>) => {
      const productId = action.payload;
      state.items = state.items.filter((item) => item.product.id !== productId);

      const computed = calculateTotals(state.items);
      state.subtotal = computed.subtotal;
      state.tax = computed.tax;
      state.total = computed.total;
      saveToLocalStorage(state.items);
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart } = cartSlice.actions;

export default cartSlice.reducer;
