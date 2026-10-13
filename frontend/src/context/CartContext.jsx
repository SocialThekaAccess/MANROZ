import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existing = state.items.find(
        (i) => i.id === action.payload.id && i.size === action.payload.size
      );
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === action.payload.id && i.size === action.payload.size
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }
      return { ...state, items: [...state.items, { ...action.payload, quantity: 1 }] };
    }
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(
          (i) => !(i.id === action.payload.id && i.size === action.payload.size)
        ),
      };
    case 'UPDATE_QUANTITY':
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(
            (i) => !(i.id === action.payload.id && i.size === action.payload.size)
          ),
        };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.payload.id && i.size === action.payload.size
            ? { ...i, quantity: action.payload.quantity }
            : i
        ),
      };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    default:
      return state;
  }
};

const getInitialCart = () => {
  try {
    const saved = localStorage.getItem('manroz_cart');
    return saved ? JSON.parse(saved) : { items: [] };
  } catch {
    return { items: [] };
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, getInitialCart());

  useEffect(() => {
    localStorage.setItem('manroz_cart', JSON.stringify(state));
  }, [state]);

  const addToCart = (product, size) => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        id: product.id,
        handle: product.handle,
        title: product.title,
        image: product.images[0],
        price: product.basePrice,
        size,
      },
    });
  };

  const removeFromCart = (id, size) => dispatch({ type: 'REMOVE_FROM_CART', payload: { id, size } });

  const updateQuantity = (id, size, quantity) =>
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, size, quantity } });

  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items: state.items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
