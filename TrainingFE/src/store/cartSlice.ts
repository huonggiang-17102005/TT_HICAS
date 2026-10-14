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

const getCartStorageKey = (): string => {
  try {
    const auth = localStorage.getItem('auth_user');
    if (auth) {
      const user = JSON.parse(auth);
      if (user && user.id) {
        return `cart_items_${user.id}`;
      }
    }
  } catch {
  }
  return 'cart_items_guest';
};

const saveToLocalStorage = (items: ICartItem[]) => {
  try {
    const key = getCartStorageKey();
    localStorage.setItem(key, JSON.stringify(items));
  } catch {
  }
};

const loadInitialState = (): ICartState => {
  try {
    const key = getCartStorageKey();
    const saved = localStorage.getItem(key);
    if (saved) {
      const items: ICartItem[] = JSON.parse(saved);
      const { subtotal, tax, total } = calculateTotals(items);
      return { items, subtotal, tax, total };
    }
  } catch {
  }
  return { items: [], subtotal: 0, tax: 0, total: 0 };
};

const initialState: ICartState = loadInitialState();

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    syncCartForUser: (state) => {
      const newState = loadInitialState();
      state.items = newState.items;
      state.subtotal = newState.subtotal;
      state.tax = newState.tax;
      state.total = newState.total;
    },

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

export const { syncCartForUser, addToCart, updateQuantity, removeFromCart } = cartSlice.actions;

export default cartSlice.reducer;
