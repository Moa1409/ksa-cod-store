"use client";

import { type ReactNode } from "react";
import { CartProvider } from "@/context/CartContext";
import { CartDrawer } from "@/components/CartDrawer";
import { CheckoutModal } from "@/components/CheckoutModal";
import { PixelLoader } from "@/components/PixelLoader";
import { SiteAnalytics } from "@/components/SiteAnalytics";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      {children}
      <CartDrawer />
      <CheckoutModal />
      <PixelLoader />
      <SiteAnalytics />
    </CartProvider>
  );
}
