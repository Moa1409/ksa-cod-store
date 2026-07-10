import { Play } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";

const labels = ["فيديو عميلة", "قبل / بعد", "تجربة حقيقية", "ريفيو صانعة محتوى", "أثناء الاستخدام", "لقطة سناب"];

export function CreatorWall() {
  return (
    <section className="section">
      <div className="container-lg">
        <SectionHeading
          eyebrow="شفناكم تحبونها"
          title="شوهدت على تيك توك وسناب شات"
          subtitle="آلاف الفيديوهات والتجارب من عميلاتنا وصانعات المحتوى في السعودية."
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {labels.map((l) => (
            <div
              key={l}
              className="group relative aspect-[9/16] overflow-hidden rounded-2xl border border-brand-rose/50 bg-gradient-to-br from-brand-rose/50 via-brand-cream to-brand-gold/20"
            >
              <div className="absolute inset-0 grid place-items-center">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-white/80 text-brand-primary shadow-soft transition group-hover:scale-110">
                  <Play className="h-5 w-5" />
                </span>
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-plum/70 to-transparent p-2 text-center text-[11px] font-semibold text-white">
                {l}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm font-bold text-brand-plum">
          <span className="chip">TikTok</span>
          <span className="chip">Snapchat</span>
          <span className="chip">Instagram</span>
        </div>
      </div>
    </section>
  );
}
