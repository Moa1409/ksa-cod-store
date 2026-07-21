"use client";

import Link from "next/link";
import { BadgeCheck, Banknote, Mail, ShieldCheck } from "lucide-react";
import { CollapsibleMenu } from "@/components/CollapsibleMenu";
import { Logo } from "@/components/Logo";
import { products } from "@/lib/products";
import { CONTACT_EMAIL } from "@/lib/site";

function FooterLinks({ children }: { children: React.ReactNode }) {
  return <ul className="space-y-2 px-3 pb-1 text-sm text-brand-cream/80">{children}</ul>;
}

export function SiteFooter() {
  return (
    <footer className="mt-8 bg-brand-plum text-brand-cream">
      <div className="container-lg grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="rounded-2xl bg-brand-cream/95 p-3 [width:fit-content]">
            <Logo />
          </div>
          <p className="mt-4 text-sm text-brand-cream/80">
            طقوس الصالون المعتمدة في بيتكِ — كيراتين · عطر شعر · تقوية من الداخل.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-xs text-brand-cream/80">
            <span className="inline-flex items-center gap-1">
              <BadgeCheck className="h-4 w-4 text-brand-gold" /> ISO 22716 · MSDS
            </span>
            <span className="inline-flex items-center gap-1">
              <Banknote className="h-4 w-4 text-brand-gold" /> الدفع عند الاستلام
            </span>
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="h-4 w-4 text-brand-gold" /> ضمان ٣٠ يوم
            </span>
          </div>
          <div className="mt-4 flex gap-3 text-sm">
            <a href="https://tiktok.com" className="hover:text-brand-gold">TikTok</a>
            <a href="https://snapchat.com" className="hover:text-brand-gold">Snapchat</a>
            <a href="https://instagram.com" className="hover:text-brand-gold">Instagram</a>
          </div>
        </div>

        {/* Desktop columns */}
        <div className="hidden sm:block">
          <h3 className="mb-3 font-bold text-brand-cream">تسوّقي</h3>
          <FooterLinks>
            <li>
              <Link href="/shop" className="hover:text-brand-gold">المتجر</Link>
            </li>
            {products.map((p) => (
              <li key={p.slug}>
                <Link href={`/product/${p.slug}`} className="hover:text-brand-gold">
                  {p.name}
                </Link>
              </li>
            ))}
          </FooterLinks>
        </div>

        <div className="hidden sm:block">
          <h3 className="mb-3 font-bold text-brand-cream">المتجر</h3>
          <FooterLinks>
            <li>
              <Link href="/about" className="hover:text-brand-gold">من نحن</Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-brand-gold">تواصلي معنا</Link>
            </li>
            <li>
              <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex items-center gap-1.5 hover:text-brand-gold" dir="ltr">
                <Mail className="h-4 w-4 shrink-0" />
                {CONTACT_EMAIL}
              </a>
            </li>
          </FooterLinks>
        </div>

        <div className="hidden sm:block">
          <h3 className="mb-3 font-bold text-brand-cream">السياسات</h3>
          <FooterLinks>
            <li>
              <Link href="/policies/shipping" className="hover:text-brand-gold">الشحن والتوصيل</Link>
            </li>
            <li>
              <Link href="/policies/returns" className="hover:text-brand-gold">الاستبدال والاسترجاع</Link>
            </li>
            <li>
              <Link href="/policies/privacy" className="hover:text-brand-gold">الخصوصية</Link>
            </li>
            <li>
              <Link href="/policies/terms" className="hover:text-brand-gold">الشروط والأحكام</Link>
            </li>
          </FooterLinks>
        </div>

        {/* Mobile collapsible menus */}
        <div className="sm:hidden">
          <CollapsibleMenu title="تسوّقي" variant="dark" className="!border-brand-cream/20">
            <FooterLinks>
              <li>
                <Link href="/shop" className="hover:text-brand-gold">المتجر</Link>
              </li>
              {products.map((p) => (
                <li key={p.slug}>
                  <Link href={`/product/${p.slug}`} className="hover:text-brand-gold">
                    {p.name}
                  </Link>
                </li>
              ))}
            </FooterLinks>
          </CollapsibleMenu>

          <CollapsibleMenu title="المتجر" variant="dark" className="!border-brand-cream/20">
            <FooterLinks>
              <li>
                <Link href="/about" className="hover:text-brand-gold">من نحن</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-gold">تواصلي معنا</Link>
              </li>
              <li>
                <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex items-center gap-1.5 hover:text-brand-gold" dir="ltr">
                  <Mail className="h-4 w-4 shrink-0" />
                  {CONTACT_EMAIL}
                </a>
              </li>
            </FooterLinks>
          </CollapsibleMenu>

          <CollapsibleMenu title="السياسات" variant="dark" className="!border-brand-cream/20">
            <FooterLinks>
              <li>
                <Link href="/policies/shipping" className="hover:text-brand-gold">الشحن والتوصيل</Link>
              </li>
              <li>
                <Link href="/policies/returns" className="hover:text-brand-gold">الاستبدال والاسترجاع</Link>
              </li>
              <li>
                <Link href="/policies/privacy" className="hover:text-brand-gold">الخصوصية</Link>
              </li>
              <li>
                <Link href="/policies/terms" className="hover:text-brand-gold">الشروط والأحكام</Link>
              </li>
            </FooterLinks>
          </CollapsibleMenu>
        </div>
      </div>

      <div className="border-t border-brand-cream/15">
        <div className="container-lg flex flex-col items-center justify-between gap-2 py-4 text-xs text-brand-cream/70 sm:flex-row">
          <span>© 2026 لمسة توهج — جميع الحقوق محفوظة</span>
          <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex items-center gap-1 hover:text-brand-gold" dir="ltr">
            <Mail className="h-3.5 w-3.5" />
            {CONTACT_EMAIL}
          </a>
        </div>
      </div>
    </footer>
  );
}
