"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { cartSavings, cartSubtotal, type CartLine } from "@/lib/pricing";

export type CartItem = {
  slug: string;
  name: string;
  emoji: string;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  savings: number;
  hydrated: boolean;
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  removeItem: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  clear: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  isCheckoutOpen: boolean;
  openCheckout: () => void;
  closeCheckout: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "lamsa_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items, hydrated]);

  function addItem(item: Omit<CartItem, "qty">, qty = 1) {
    setItems((prev) => {
      const found = prev.find((p) => p.slug === item.slug);
      if (found) {
        return prev.map((p) =>
          p.slug === item.slug ? { ...p, qty: p.qty + qty } : p,
        );
      }
      return [...prev, { ...item, qty }];
    });
    setIsCartOpen(true);
  }

  function removeItem(slug: string) {
    setItems((prev) => prev.filter((p) => p.slug !== slug));
  }

  function setQty(slug: string, qty: number) {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((p) => p.slug !== slug)
        : prev.map((p) => (p.slug === slug ? { ...p, qty } : p)),
    );
  }

  function clear() {
    setItems([]);
  }

  const count = useMemo(() => items.reduce((n, i) => n + i.qty, 0), [items]);
  const cartLines = useMemo<CartLine[]>(
    () => items.map((i) => ({ slug: i.slug, qty: i.qty })),
    [items],
  );
  const subtotal = useMemo(() => cartSubtotal(cartLines), [cartLines]);
  const savings = useMemo(() => cartSavings(cartLines), [cartLines]);

  const value: CartContextValue = {
    items,
    count,
    subtotal,
    savings,
    hydrated,
    addItem,
    removeItem,
    setQty,
    clear,
    isCartOpen,
    openCart: () => setIsCartOpen(true),
    closeCart: () => setIsCartOpen(false),
    isCheckoutOpen,
    openCheckout: () => {
      setIsCartOpen(false);
      setIsCheckoutOpen(true);
    },
    closeCheckout: () => setIsCheckoutOpen(false),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
