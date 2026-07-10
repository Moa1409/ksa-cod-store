export type Review = {
  name: string;
  city: string;
  text: string;
  stars: number;
};

export type Product = {
  slug: string;
  name: string;
  nameEn: string;
  tagline: string;
  emoji: string;
  price: number;
  compareAt: number;
  rating: number;
  reviewsCount: number;
  problem: string;
  benefits: string[];
  how: { title: string; text: string }[];
  specs: { label: string; value: string }[];
  faq: { q: string; a: string }[];
  reviews: Review[];
};

export const products: Product[] = [
  {
    slug: "air-glow",
    name: "لمسة إيرغلو",
    nameEn: "Lamsa AirGlow",
    tagline: "صالونكِ الخاص في بيتكِ — تسريحة أحلامكِ في ٥ دقائق",
    emoji: "💨",
    price: 199,
    compareAt: 199,
    rating: 4.8,
    reviewsCount: 12000,
    problem:
      "تسريحة الصالون غالية وتاخذ وقت، وتصفيف الشعر بالبيت ما يطلع مثل ما تتمنين.",
    benefits: [
      "تسريحة صالون في دقائق — جفّفي وصفّفي بخطوة واحدة",
      "تقنية أيونية تحمي شعركِ من التلف وتقلّل التقصّف",
      "٥ رؤوس قابلة للتبديل تناسب كل أنواع الشعر",
      "لمعان يدوم مع حرارة موزّعة بذكاء",
    ],
    how: [
      {
        title: "التقنية الأيونية",
        text: "أيونات سالبة تقفل قشرة الشعرة فتحبس اللمعان وتقلّل التطاير.",
      },
      {
        title: "حرارة سيراميك–تورمالين",
        text: "حرارة متساوية تحمي الشعر من الحرق الموضعي.",
      },
      {
        title: "تدفّق هوائي دوّار",
        text: "يلفّ الخصلة تلقائيًا للفّات مثالية بدون شدّ.",
      },
    ],
    specs: [
      { label: "الرؤوس", value: "٥ رؤوس قابلة للتبديل" },
      { label: "المادة", value: "سيراميك–تورمالين + أيونية" },
      { label: "القدرة", value: "1000W، جهد مزدوج 110/220V" },
      { label: "الشهادات", value: "CE · RoHS" },
      { label: "الضمان", value: "سنة كاملة" },
    ],
    faq: [
      {
        q: "هل يصلح لكل أنواع الشعر؟",
        a: "نعم، ٣ درجات حرارة و٥ رؤوس تناسب الشعر الناعم والخشن والمجعّد.",
      },
      {
        q: "هل يتلف الشعر؟",
        a: "لا، التقنية الأيونية والحرارة الموزّعة تحمي الشعر وتقلّل التقصّف.",
      },
      { q: "كم ياخذ وقت؟", a: "غالبًا ٥–١٠ دقائق حسب طول الشعر." },
      {
        q: "متى يوصل الطلب؟",
        a: "شحن سريع لكل مدن المملكة مع رابط تتبّع وتأكيد على واتساب.",
      },
      { q: "كيف أدفع؟", a: "ادفعي عند الاستلام — تفحصين المنتج قبل الدفع." },
    ],
    reviews: [
      {
        name: "شهد",
        city: "الرياض",
        stars: 5,
        text: "صرت أسوّي فوني بروش بنفسي بدون صالون، وفّرت وايد!",
      },
      {
        name: "سارة",
        city: "جدة",
        stars: 5,
        text: "اللمعان خيالي وشعري ما تقصّف، أنصح فيه بشدة.",
      },
      {
        name: "أفنان",
        city: "الدمام",
        stars: 5,
        text: "خفيف وسهل، جهّزت شعري لعرس صديقتي في ١٠ دقائق.",
      },
    ],
  },
  {
    slug: "silk-pro",
    name: "لمسة سيلك برو",
    nameEn: "Lamsa SilkPro",
    tagline: "بشرة ناعمة كالحرير — إزالة الشعر بتقنية IPL في بيتكِ",
    emoji: "✨",
    price: 199,
    compareAt: 199,
    rating: 4.7,
    reviewsCount: 8500,
    problem:
      "إزالة الشعر المتكررة مؤلمة، مكلّفة، وتاخذ وقت — والنتيجة ما تدوم.",
    benefits: [
      "تقنية IPL لتقليل نمو الشعر تدريجيًا",
      "نظام تبريد سفير يخفّف الإحساس أثناء الاستخدام",
      "٨ مستويات طاقة تناسب مناطق الجسم المختلفة",
      "استخدام سهل وخصوصية تامة في بيتكِ",
    ],
    how: [
      {
        title: "ضوء IPL مكثّف",
        text: "يستهدف بصيلة الشعرة لإبطاء النمو مع الاستخدام المنتظم.",
      },
      {
        title: "تبريد سفير",
        text: "سطح بارد يجعل الجلسة أكثر راحة.",
      },
      {
        title: "مستشعر البشرة",
        text: "يضبط الطاقة حسب المنطقة للاستخدام المريح.",
      },
    ],
    specs: [
      { label: "الومضات", value: "+500,000 ومضة" },
      { label: "المستويات", value: "٨ مستويات طاقة" },
      { label: "التبريد", value: "نظام تبريد سفير" },
      { label: "الشهادات", value: "CE · RoHS" },
      { label: "الضمان", value: "سنة كاملة" },
    ],
    faq: [
      {
        q: "هل هو مريح أثناء الاستخدام؟",
        a: "نظام التبريد بالسفير يجعل الجلسة أكثر راحة مقارنة بالطرق التقليدية.",
      },
      {
        q: "متى ألاحظ الفرق؟",
        a: "مع الاستخدام المنتظم لعدة أسابيع. النتائج تختلف من شخص لآخر.",
      },
      {
        q: "هل يصلح لكل مناطق الجسم؟",
        a: "٨ مستويات طاقة تناسب الساق، الإبط، ومنطقة البكيني.",
      },
      { q: "كيف أدفع؟", a: "ادفعي عند الاستلام — تفحصين المنتج قبل الدفع." },
    ],
    reviews: [
      {
        name: "ريم",
        city: "الرياض",
        stars: 5,
        text: "استخدامه سهل والتبريد مريح، صرت أسويه بالبيت وأنا مرتاحة.",
      },
      {
        name: "لمى",
        city: "مكة",
        stars: 4,
        text: "لاحظت فرق مع الاستمرار، والخصوصية أهم شي بالنسبة لي.",
      },
    ],
  },
  {
    slug: "glow-lift",
    name: "لمسة غلو ليفت",
    nameEn: "Lamsa GlowLift",
    tagline: "نضارة وإشراقة — روتين العناية بالبشرة في بيتكِ",
    emoji: "🌟",
    price: 199,
    compareAt: 199,
    rating: 4.6,
    reviewsCount: 5200,
    problem: "روتين العناية بالبشرة في العيادات مكلّف ويحتاج مواعيد متكررة.",
    benefits: [
      "تقنية تدليك دقيق لتنشيط البشرة",
      "إضاءة LED لروتين إشراقة يومي",
      "سهل الاستخدام مع جل موصّل مغذٍّ",
      "روتين نضارة في دقائق بالبيت",
    ],
    how: [
      {
        title: "تدليك دقيق",
        text: "ينشّط البشرة ويمنحها إحساسًا بالانتعاش.",
      },
      {
        title: "إضاءة LED",
        text: "روتين إشراقة يومي لطيف على البشرة.",
      },
      {
        title: "جل موصّل مغذٍّ",
        text: "حمض الهيالورونيك + الألوفيرا لترطيب أعمق.",
      },
    ],
    specs: [
      { label: "الأوضاع", value: "تدليك + إضاءة LED" },
      { label: "البطارية", value: "قابلة للشحن USB" },
      { label: "المرفقات", value: "جل موصّل مغذٍّ" },
      { label: "الشهادات", value: "CE · RoHS" },
      { label: "الضمان", value: "سنة كاملة" },
    ],
    faq: [
      {
        q: "كم مرة أستخدمه؟",
        a: "يمكن دمجه في روتينكِ اليومي لبضع دقائق. النتائج تختلف من شخص لآخر.",
      },
      { q: "هل يشمل الجل؟", a: "نعم، يأتي مع جل موصّل مغذٍّ." },
      { q: "كيف أدفع؟", a: "ادفعي عند الاستلام." },
    ],
    reviews: [
      {
        name: "هند",
        city: "الرياض",
        stars: 5,
        text: "أحسّه ريلاكس بعد يوم طويل، والبشرة تحسّ بالانتعاش.",
      },
      {
        name: "دانة",
        city: "الخبر",
        stars: 4,
        text: "صار جزء من روتيني اليومي، حلو وسهل.",
      },
    ],
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getCrossSellDevices(slug: string): Product[] {
  return products.filter((p) => p.slug !== slug);
}

// ---- Pricing / offer model -------------------------------------------------
// Every device is 199. Quantity bundle: 2 → 279, 3 → 349. Extra units beyond 3
// continue at the special price. The ONLY discounted price shown anywhere is the
// post-checkout upsell (99). Cross-sells everywhere use the base price (199).
export const BASE_PRICE = 199;
export const UPSELL_PRICE = 99;
export const BUNDLE_HINT = "عرض: قطعتان بـ 279 · 3 قطع بـ 349 ر.س";

export function bundleTotal(count: number): number {
  if (count <= 0) return 0;
  if (count === 1) return 199;
  if (count === 2) return 279;
  return 349 + (count - 3) * UPSELL_PRICE;
}
