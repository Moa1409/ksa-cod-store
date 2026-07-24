import type { Metadata } from "next";
import { Poppins, Reem_Kufi, Tajawal } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { env } from "@/lib/env";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-tajawal",
  display: "swap",
});
const reem = Reem_Kufi({
  subsets: ["arabic", "latin"],
  weight: ["500", "700"],
  variable: "--font-reem",
  display: "swap",
});
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  title: {
    default: "لمسة توهج | Lamsa Glow — دار العناية التجميلية المعتمدة في بيتكِ",
    template: "%s | لمسة توهج",
  },
  description:
    "لمسة توهج — دار عناية تجميلية بمعايير عالمية: ماسك كيراتين كولاجين، عطر شعر للحجاب، وعلكات الجمال. ISO 22716 · GMP · MSDS · COA · الدفع عند الاستلام.",
  openGraph: {
    type: "website",
    locale: "ar_SA",
    siteName: "لمسة توهج",
    title: "لمسة توهج | دار العناية التجميلية المعتمدة",
    description:
      "مكوّنات فعّالة مكتوبة بوضوح · شهادات ISO وGMP · ثقة عند الباب. Certified beauty care house for the Saudi woman.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${tajawal.variable} ${reem.variable} ${poppins.variable}`}>
      <body className="font-sans">
        <Providers>
          <SiteHeader />
          <main className="min-h-[60vh]">{children}</main>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
