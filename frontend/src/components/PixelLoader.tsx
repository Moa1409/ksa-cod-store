"use client";

import { useEffect } from "react";
import { initPixels } from "@/lib/tracking";

// Load pixel stubs as soon as the client hydrates so Pixel Helper / ads
// can detect them. Scripts themselves stay async and non-blocking.
export function PixelLoader() {
  useEffect(() => {
    initPixels();
  }, []);

  return null;
}
