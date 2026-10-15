import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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

export const loadCartFromStorage = (): ICartState => {
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

export const saveCartToStorage = (items: ICartItem[]) => {
  try {
    const key = getCartStorageKey();
    localStorage.setItem(key, JSON.stringify(items));
  } catch {
  }
};

export const CART_QUERY_KEY = ['cart'];

export const useCart = () => {
  const queryClient = useQueryClient();

  const { data: cart = { items: [], subtotal: 0, tax: 0, total: 0 }, isLoading } = useQuery<ICartState>({
    queryKey: CART_QUERY_KEY,
    queryFn: async () => loadCartFromStorage(),
    initialData: loadCartFromStorage,
  });

  const getCurrentItems = (): ICartItem[] => {
    const cached = queryClient.getQueryData<ICartState>(CART_QUERY_KEY);
    if (cached) return cached.items;
    return loadCartFromStorage().items;
  };

  const updateCartState = async (items: ICartItem[]): Promise<ICartState> => {
    const computed = calculateTotals(items);
    const newState: ICartState = { items, ...computed };
    saveCartToStorage(items);
    queryClient.setQueryData<ICartState>(CART_QUERY_KEY, newState);
    await queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    return newState;
  };

  const addToCartMutation = useMutation({
    mutationFn: async ({ product, quantity = 1 }: { product: IProduct; quantity?: number }) => {
      const currentItems = [...getCurrentItems()];
      const existingIndex = currentItems.findIndex((item) => item.product.id === product.id);

      if (existingIndex > -1) {
        currentItems[existingIndex] = {
          ...currentItems[existingIndex],
          quantity: currentItems[existingIndex].quantity + quantity,
        };
      } else {
        currentItems.push({ product, quantity });
      }

      return updateCartState(currentItems);
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: number; quantity: number }) => {
      let currentItems = [...getCurrentItems()];
      if (quantity <= 0) {
        currentItems = currentItems.filter((item) => item.product.id !== productId);
      } else {
        currentItems = currentItems.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        );
      }
      return updateCartState(currentItems);
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (productId: number) => {
      const currentItems = getCurrentItems().filter((item) => item.product.id !== productId);
      return updateCartState(currentItems);
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      return updateCartState([]);
    },
  });

  const syncCartForUser = () => {
    const freshCart = loadCartFromStorage();
    queryClient.setQueryData<ICartState>(CART_QUERY_KEY, freshCart);
  };

  const totalItemsCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    cart,
    items: cart.items,
    subtotal: cart.subtotal,
    tax: cart.tax,
    total: cart.total,
    totalItemsCount,
    isLoading,
    addToCart: (product: IProduct, quantity = 1) => addToCartMutation.mutateAsync({ product, quantity }),
    updateQuantity: (productId: number, quantity: number) =>
      updateQuantityMutation.mutateAsync({ productId, quantity }),
    removeFromCart: (productId: number) => removeFromCartMutation.mutateAsync(productId),
    clearCart: () => clearCartMutation.mutateAsync(),
    syncCartForUser,
  };
};
