import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { formatPrice, getProduct } from "../catalog";

const CartContext = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const { productId } = action;
      const existing = state.items.find((item) => item.productId === productId);
      if (existing) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item,
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { productId, quantity: 1 }],
      };
    }
    case "INCREMENT": {
      const { productId } = action;
      return {
        ...state,
        items: state.items.map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item,
        ),
      };
    }
    case "DECREMENT": {
      const { productId } = action;
      return {
        ...state,
        items: state.items
          .map((item) =>
            item.productId === productId ? { ...item, quantity: item.quantity - 1 } : item,
          )
          .filter((item) => item.quantity > 0),
      };
    }
    case "REMOVE": {
      const { productId } = action;
      return {
        ...state,
        items: state.items.filter((item) => item.productId !== productId),
      };
    }
    case "CLEAR": {
      return { ...state, items: [] };
    }
    default:
      return state;
  }
}

const initialState = { items: [] };

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState, (initial) => {
    if (typeof window === "undefined") return initial;
    try {
      const stored = window.localStorage.getItem("cart");
      if (!stored) return initial;
      const parsed = JSON.parse(stored);
      if (!parsed || !Array.isArray(parsed.items)) return initial;
      return { items: parsed.items };
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem("cart", JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state]);

  const value = useMemo(() => {
    const detailedItems = state.items
      .map(({ productId, quantity }) => {
        const product = getProduct(productId);
        if (!product) return null;
        const lineTotal = product.price * quantity;
        return {
          productId,
          quantity,
          product,
          lineTotal,
          lineTotalFormatted: formatPrice(lineTotal),
        };
      })
      .filter(Boolean);

    const subtotal = detailedItems.reduce((sum, item) => sum + item.lineTotal, 0);
    const totalQuantity = detailedItems.reduce((sum, item) => sum + item.quantity, 0);

    return {
      items: detailedItems,
      subtotal,
      subtotalFormatted: formatPrice(subtotal),
      total: subtotal,
      totalFormatted: formatPrice(subtotal),
      totalQuantity,
      addItem: (productId) => dispatch({ type: "ADD_ITEM", productId }),
      increment: (productId) => dispatch({ type: "INCREMENT", productId }),
      decrement: (productId) => dispatch({ type: "DECREMENT", productId }),
      removeItem: (productId) => dispatch({ type: "REMOVE", productId }),
      clear: () => dispatch({ type: "CLEAR" }),
    };
  }, [state]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}

