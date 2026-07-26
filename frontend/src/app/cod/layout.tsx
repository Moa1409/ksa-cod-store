import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin · Lamsa Glow",
  description: "Lamsa Glow COD admin dashboard",
  robots: { index: false, follow: false },
};

export default function CodAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div lang="en" dir="ltr" className="min-h-screen bg-brand-cream">
      {children}
    </div>
  );
}
