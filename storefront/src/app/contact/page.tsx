import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata = {
  title: "تواصلي معنا | Lamsa Glow — لمسة",
  description: "فريق لمسة جلو هنا لمساعدتكِ. تواصلي معنا بأي وقت.",
};

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main className="container-noora py-12">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-3xl font-extrabold text-noora-plum">
            تواصلي معنا
          </h1>
          <p className="mt-2 text-noora-ink/70">
            فريق لمسة جلو هنا لمساعدتكِ — من الطلب حتى الاستلام.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="card">
              <div className="text-2xl">📧</div>
              <div className="mt-2 font-bold text-noora-plum">
                البريد الإلكتروني
              </div>
              <a
                href="mailto:care@lamsaglow.shop"
                className="text-noora-rose hover:underline"
              >
                care@lamsaglow.shop
              </a>
            </div>
            <div className="card">
              <div className="text-2xl">🕐</div>
              <div className="mt-2 font-bold text-noora-plum">أوقات العمل</div>
              <p className="text-noora-ink/70">السبت – الخميس، 9ص – 9م</p>
            </div>
          </div>

          <form
            action="mailto:care@lamsaglow.shop"
            method="post"
            encType="text/plain"
            className="card mt-6 space-y-4"
          >
            <div className="font-bold text-noora-plum">أرسلي لنا رسالة</div>
            <input
              name="name"
              required
              placeholder="الاسم"
              className="w-full rounded-2xl border border-noora-roseSoft bg-white px-4 py-3 outline-none focus:border-noora-rose"
            />
            <input
              name="contact"
              required
              placeholder="البريد أو رقم الجوال"
              className="w-full rounded-2xl border border-noora-roseSoft bg-white px-4 py-3 outline-none focus:border-noora-rose"
            />
            <textarea
              name="message"
              required
              rows={4}
              placeholder="رسالتكِ"
              className="w-full rounded-2xl border border-noora-roseSoft bg-white px-4 py-3 outline-none focus:border-noora-rose"
            />
            <button type="submit" className="btn-primary w-full">
              إرسال
            </button>
          </form>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
