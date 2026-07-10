import type { Metadata } from "next";
import { Clock, Mail, MessageCircle, Truck } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { CONTACT_EMAIL } from "@/lib/site";
export const metadata: Metadata = {
  title: "تواصلي معنا",
  description: "فريق لمسة توهج جاهز لمساعدتكِ — تواصلي معنا عبر البريد أو النموذج.",
};

export default function ContactPage() {
  return (
    <section className="section">
      <div className="container-lg grid gap-8 md:grid-cols-2">
        <div>
          <h1 className="text-3xl font-extrabold sm:text-4xl">تواصلي معنا</h1>
          <p className="mt-3 text-brand-ink/85">
            عندكِ سؤال عن منتج أو طلب؟ فريقنا سعيد يساعدكِ.
          </p>
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-rose/40">
                <Mail className="h-5 w-5 text-brand-primary" />
              </span>
              <div>
                <div className="font-bold text-brand-plum">البريد الإلكتروني</div>
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-sm text-brand-primary" dir="ltr">{CONTACT_EMAIL}</a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-rose/40">
                <Clock className="h-5 w-5 text-brand-primary" />
              </span>
              <div>
                <div className="font-bold text-brand-plum">أوقات العمل</div>
                <div className="text-sm text-brand-ink/80">يوميًا ٩ صباحًا – ٩ مساءً</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-rose/40">
                <Truck className="h-5 w-5 text-brand-primary" />
              </span>
              <div>
                <div className="font-bold text-brand-plum">تتبّع الطلب</div>
                <div className="text-sm text-brand-ink/80">راسلينا برقم جوالكِ ونطلعكِ على حالة طلبكِ.</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-rose/40">
                <MessageCircle className="h-5 w-5 text-brand-primary" />
              </span>
              <div>
                <div className="font-bold text-brand-plum">الرد المتوقّع</div>
                <div className="text-sm text-brand-ink/80">عادةً خلال ساعات قليلة في أيام العمل.</div>
              </div>
            </div>
          </div>
        </div>

        <ContactForm />
      </div>
    </section>
  );
}
