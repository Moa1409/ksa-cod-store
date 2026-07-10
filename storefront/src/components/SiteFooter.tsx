import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-noora-roseSoft/50 bg-white/60">
      <div className="container-noora grid gap-8 py-12 md:grid-cols-4">
        <div>
          <div className="text-xl font-extrabold text-noora-plum">
            Lamsa Glow · لمسة
          </div>
          <p className="mt-3 text-sm text-noora-ink/70">
            العيادة الجمالية المنزلية — أجهزة تجميل فاخرة توصلكِ لإطلالة الصالون
            في بيتكِ.
          </p>
        </div>

        <div className="text-sm text-noora-ink/80">
          <div className="font-bold text-noora-plum">المتجر</div>
          <ul className="mt-3 space-y-2">
            <li>
              <Link href="/shop" className="hover:text-noora-rose">
                كل المنتجات
              </Link>
            </li>
            <li>
              <Link href="/product/air-glow" className="hover:text-noora-rose">
                لمسة إيرغلو
              </Link>
            </li>
            <li>
              <Link href="/product/silk-pro" className="hover:text-noora-rose">
                لمسة سيلك برو
              </Link>
            </li>
            <li>
              <Link href="/product/glow-lift" className="hover:text-noora-rose">
                لمسة غلو ليفت
              </Link>
            </li>
          </ul>
        </div>

        <div className="text-sm text-noora-ink/80">
          <div className="font-bold text-noora-plum">السياسات</div>
          <ul className="mt-3 space-y-2">
            <li>
              <Link href="/policies/shipping" className="hover:text-noora-rose">
                الشحن والتوصيل
              </Link>
            </li>
            <li>
              <Link href="/policies/returns" className="hover:text-noora-rose">
                الاستبدال والاسترجاع
              </Link>
            </li>
            <li>
              <Link href="/policies/privacy" className="hover:text-noora-rose">
                سياسة الخصوصية
              </Link>
            </li>
            <li>
              <Link href="/policies/terms" className="hover:text-noora-rose">
                الشروط والأحكام
              </Link>
            </li>
          </ul>
        </div>

        <div className="text-sm text-noora-ink/80">
          <div className="font-bold text-noora-plum">تواصلي معنا</div>
          <ul className="mt-3 space-y-2">
            <li>
              <Link href="/contact" className="hover:text-noora-rose">
                صفحة التواصل
              </Link>
            </li>
            <li>البريد: care@lamsaglow.shop</li>
          </ul>
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <span className="badge">✅ CE / RoHS</span>
            <span className="badge">✅ الدفع عند الاستلام</span>
            <span className="badge">✅ ضمان سنة</span>
          </div>
        </div>
      </div>
      <div className="border-t border-noora-roseSoft/40 py-4 text-center text-xs text-noora-ink/60">
        © {new Date().getFullYear()} Lamsa Glow. جميع الحقوق محفوظة. النتائج تختلف من
        شخص لآخر.
      </div>
    </footer>
  );
}
