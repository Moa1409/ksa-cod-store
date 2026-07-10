import type { MetadataRoute } from "next";
import { env } from "@/lib/env";
import { allSlugs } from "@/lib/products";
import { policies } from "@/lib/policies";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = env.siteUrl.replace(/\/$/, "");
  const routes = ["", "/shop", "/about", "/contact"].map((r) => ({
    url: `${base}${r}`,
    lastModified: new Date(),
  }));
  const productRoutes = allSlugs().map((s) => ({
    url: `${base}/product/${s}`,
    lastModified: new Date(),
  }));
  const policyRoutes = policies.map((p) => ({
    url: `${base}/policies/${p.slug}`,
    lastModified: new Date(),
  }));
  return [...routes, ...productRoutes, ...policyRoutes];
}
