import { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const exists = state.items.find((i) => i.id === action.payload.id);
      if (exists) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === action.payload.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { ...state, items: [...state.items, { ...action.payload, quantity: 1 }] };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((i) => i.id !== action.payload) };
    case 'INCREASE_QTY':
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.payload ? { ...i, quantity: i.quantity + 1 } : i
        ),
      };
    case 'DECREASE_QTY':
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.payload ? { ...i, quantity: Math.max(1, i.quantity - 1) } : i
        ),
      };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'LOAD_CART':
      return { ...state, items: action.payload };
    default:
      return state;
  }
}

const CART_KEY = (userId) => `shopvault_cart_${userId}`;

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  // Load cart when user logs in
  useEffect(() => {
    if (user) {
      try {
        const saved = JSON.parse(localStorage.getItem(CART_KEY(user.id)) || '[]');
        dispatch({ type: 'LOAD_CART', payload: saved });
      } catch {
        dispatch({ type: 'LOAD_CART', payload: [] });
      }
    } else {
      dispatch({ type: 'CLEAR_CART' });
    }
  }, [user?.id]);

  // Persist cart
  useEffect(() => {
    if (user) {
      localStorage.setItem(CART_KEY(user.id), JSON.stringify(state.items));
    }
  }, [state.items, user?.id]);

  const addItem = (product) => dispatch({ type: 'ADD_ITEM', payload: product });
  const removeItem = (id) => dispatch({ type: 'REMOVE_ITEM', payload: id });
  const increaseQty = (id) => dispatch({ type: 'INCREASE_QTY', payload: id });
  const decreaseQty = (id) => dispatch({ type: 'DECREASE_QTY', payload: id });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });
  const isInCart = (id) => state.items.some((i) => i.id === id);

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ ...state, addItem, removeItem, increaseQty, decreaseQty, clearCart, isInCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
