"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode
} from "react";
import type { MenuItem } from "@/data/menu";
import {
  trackProductAdded,
  trackProductRemoved
} from "@/lib/yandex-metrika";

export type CartLine = {
  id: string;
  category?: string;
  name: string;
  price: number;
  weight: string;
  quantity: number;
};

type CartState = {
  lines: CartLine[];
  lastAddedAt: number;
};

type CartAction =
  | { type: "add"; item: MenuItem }
  | { type: "increment"; id: string }
  | { type: "decrement"; id: string }
  | { type: "remove"; id: string }
  | { type: "clear" }
  | { type: "hydrate"; lines: CartLine[] };

type CartContextValue = {
  lines: CartLine[];
  isOpen: boolean;
  lastAddedAt: number;
  totalItems: number;
  totalPrice: number;
  openCart: () => void;
  closeCart: () => void;
  setCartOpen: (open: boolean) => void;
  addItem: (item: MenuItem) => void;
  incrementItem: (id: string) => void;
  decrementItem: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  getQuantity: (id: string) => number;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "zhanklod-cart-v1";

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "hydrate":
      return { ...state, lines: action.lines };
    case "add": {
      const existing = state.lines.find((line) => line.id === action.item.id);
      const lines = existing
        ? state.lines.map((line) =>
            line.id === action.item.id
              ? { ...line, quantity: line.quantity + 1 }
              : line
          )
        : [
            ...state.lines,
            {
              id: action.item.id,
              category: action.item.category,
              name: action.item.name,
              price: action.item.price,
              weight: action.item.weight,
              quantity: 1
            }
          ];

      return { lines, lastAddedAt: Date.now() };
    }
    case "increment":
      return {
        ...state,
        lines: state.lines.map((line) =>
          line.id === action.id ? { ...line, quantity: line.quantity + 1 } : line
        )
      };
    case "decrement":
      return {
        ...state,
        lines: state.lines
          .map((line) =>
            line.id === action.id
              ? { ...line, quantity: line.quantity - 1 }
              : line
          )
          .filter((line) => line.quantity > 0)
      };
    case "remove":
      return {
        ...state,
        lines: state.lines.filter((line) => line.id !== action.id)
      };
    case "clear":
      return { lines: [], lastAddedAt: state.lastAddedAt };
    default:
      return state;
  }
}

function readStoredCart() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as CartLine[];
    return parsed.filter(
      (line) =>
        typeof line.id === "string" &&
        typeof line.name === "string" &&
        typeof line.price === "number" &&
        typeof line.quantity === "number" &&
        line.quantity > 0
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    lines: [],
    lastAddedAt: 0
  });
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    dispatch({ type: "hydrate", lines: readStoredCart() });
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.lines));
    }
  }, [hydrated, state.lines]);

  const totalItems = useMemo(
    () => state.lines.reduce((sum, line) => sum + line.quantity, 0),
    [state.lines]
  );
  const totalPrice = useMemo(
    () => state.lines.reduce((sum, line) => sum + line.price * line.quantity, 0),
    [state.lines]
  );

  const getQuantity = useCallback(
    (id: string) => state.lines.find((line) => line.id === id)?.quantity ?? 0,
    [state.lines]
  );

  const addItem = useCallback((item: MenuItem) => {
    trackProductAdded({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      category: item.category
    });
    dispatch({ type: "add", item });
  }, []);

  const incrementItem = useCallback(
    (id: string) => {
      const line = state.lines.find((candidate) => candidate.id === id);
      if (line) {
        trackProductAdded({ ...line, quantity: 1 });
      }
      dispatch({ type: "increment", id });
    },
    [state.lines]
  );

  const decrementItem = useCallback(
    (id: string) => {
      const line = state.lines.find((candidate) => candidate.id === id);
      if (line) {
        trackProductRemoved({ ...line, quantity: 1 });
      }
      dispatch({ type: "decrement", id });
    },
    [state.lines]
  );

  const removeItem = useCallback(
    (id: string) => {
      const line = state.lines.find((candidate) => candidate.id === id);
      if (line) {
        trackProductRemoved(line);
      }
      dispatch({ type: "remove", id });
    },
    [state.lines]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      lines: state.lines,
      isOpen,
      lastAddedAt: state.lastAddedAt,
      totalItems,
      totalPrice,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      setCartOpen: setIsOpen,
      addItem,
      incrementItem,
      decrementItem,
      removeItem,
      clearCart: () => dispatch({ type: "clear" }),
      getQuantity
    }),
    [
      addItem,
      decrementItem,
      getQuantity,
      incrementItem,
      isOpen,
      removeItem,
      state.lastAddedAt,
      state.lines,
      totalItems,
      totalPrice
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
}
