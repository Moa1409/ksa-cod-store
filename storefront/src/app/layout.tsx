import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";
import CheckoutModal from "@/components/CheckoutModal";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-tajawal",
  display: "swap",
});

export const metadata: Metadata = {
  title: "لمسة جلو | Lamsa Glow — صالونكِ الخاص في بيتكِ",
  description:
    "أجهزة تجميل منزلية فاخرة: تصفيف الشعر، إزالة الشعر بتقنية IPL، ونضارة البشرة. الدفع عند الاستلام، ضمان استرجاع 30 يوم، شحن سريع لكل مدن المملكة.",
  keywords: [
    "لمسة",
    "لمسة جلو",
    "Lamsa Glow",
    "مصفف شعر",
    "ازالة الشعر IPL",
    "أجهزة تجميل منزلية",
    "الدفع عند الاستلام",
    "السعودية",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${tajawal.variable} font-sans antialiased`}>
        <CartProvider>
          {children}
          <CartDrawer />
          <CheckoutModal />
        </CartProvider>
      </body>
    </html>
  );
}
