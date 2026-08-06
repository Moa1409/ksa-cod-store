import type { Metadata } from "next";
import { Reem_Kufi, Tajawal } from "next/font/google";
import "./globals.css";
import { HeadPixels } from "@/components/HeadPixels";
import { Providers } from "@/components/Providers";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { env } from "@/lib/env";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-tajawal",
  display: "swap",
  preload: true,
});
const reem = Reem_Kufi({
  subsets: ["arabic"],
  weight: ["700"],
  variable: "--font-reem",
  display: "swap",
  preload: false,
});

const siteName = "لمسة توهج";
const defaultTitle = "لمسة توهج | Lamsa Glow — دار العناية التجميلية المعتمدة في بيتكِ";
const defaultDescription =
  "لمسة توهج — دار عناية تجميلية بمعايير عالمية: ماسك كيراتين كولاجين، عطر شعر للحجاب، وعلكات الجمال. ISO 22716 · GMP · MSDS · COA · الدفع عند الاستلام.";

export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  title: {
    default: defaultTitle,
    template: `%s | ${siteName}`,
  },
  description: defaultDescription,
  applicationName: siteName,
  authors: [{ name: "Lamsa Glow" }],
  keywords: [
    "لمسة توهج",
    "Lamsa Glow",
    "ماسك شعر",
    "عطر شعر",
    "علكات جمال",
    "كيراتين",
    "كولاجين",
    "الدفع عند الاستلام",
    "السعودية",
  ],
  openGraph: {
    type: "website",
    locale: "ar_SA",
    url: env.siteUrl,
    siteName,
    title: "لمسة توهج | دار العناية التجميلية المعتمدة",
    description:
      "مكوّنات فعّالة مكتوبة بوضوح · شهادات ISO وGMP · ثقة عند الباب. Certified beauty care house for the Saudi woman.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "لمسة توهج — روتين دار العناية التجميلية",
        type: "image/jpeg",
      },
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "لمسة توهج — روتين دار العناية التجميلية",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "لمسة توهج | دار العناية التجميلية المعتمدة",
    description: defaultDescription,
    images: ["/og-image.jpg"],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/icons/icon-48.png", type: "image/png", sizes: "48x48" },
      { url: "/icons/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icons/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" }],
    shortcut: ["/favicon.ico"],
    other: [{ rel: "mask-icon", url: "/logo.png" }],
  },
  manifest: "/site.webmanifest",
  alternates: { canonical: "/" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${env.siteUrl}/#organization`,
      name: "لمسة توهج",
      alternateName: "Lamsa Glow",
      url: env.siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${env.siteUrl}/logo.png`,
        width: 512,
        height: 512,
      },
      image: `${env.siteUrl}/og-image.jpg`,
      sameAs: [],
    },
    {
      "@type": "WebSite",
      "@id": `${env.siteUrl}/#website`,
      url: env.siteUrl,
      name: "لمسة توهج | Lamsa Glow",
      publisher: { "@id": `${env.siteUrl}/#organization` },
      inLanguage: "ar-SA",
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${tajawal.variable} ${reem.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#6B2D3C" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans">
        <HeadPixels />
        <Providers>
          <SiteHeader />
          <main className="min-h-[60vh]">{children}</main>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
