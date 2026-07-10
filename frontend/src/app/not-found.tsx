import Link from "next/link";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <section className="section">
      <div className="container-lg mx-auto max-w-md text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-brand-rose/40">
          <SearchX className="h-10 w-10 text-brand-primary" />
        </div>
        <h1 className="mt-4 text-2xl font-extrabold">الصفحة غير موجودة</h1>
        <p className="mt-2 text-brand-ink/80">يمكن الرابط قديم أو تغيّر.</p>
        <Link href="/" className="btn-primary mt-6">العودة للرئيسية</Link>
      </div>
    </section>
  );
}
