"use client";

import dynamic from "next/dynamic";
import { type ReactNode } from "react";
import { CartProvider } from "@/context/CartContext";
import { PixelLoader } from "@/components/PixelLoader";
import { SiteAnalytics } from "@/components/SiteAnalytics";

const CartDrawer = dynamic(
  () => import("@/components/CartDrawer").then((m) => m.CartDrawer),
  { ssr: false },
);
const CheckoutModal = dynamic(
  () => import("@/components/CheckoutModal").then((m) => m.CheckoutModal),
  { ssr: false },
);

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
