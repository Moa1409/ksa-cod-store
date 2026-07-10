"use client";

import { useEffect } from "react";
import { initPixels } from "@/lib/tracking";

// Defers pixel base scripts until the browser is idle or the user interacts,
// whichever comes first (with a safety timeout). Never blocks render.
export function PixelLoader() {
  useEffect(() => {
    let done = false;
    const fire = () => {
      if (done) return;
      done = true;
      initPixels();
      cleanup();
    };
    const cleanup = () => {
      window.removeEventListener("scroll", fire);
      window.removeEventListener("pointerdown", fire);
      window.removeEventListener("keydown", fire);
    };
    window.addEventListener("scroll", fire, { passive: true, once: true });
    window.addEventListener("pointerdown", fire, { once: true });
    window.addEventListener("keydown", fire, { once: true });

    const ric = (window as unknown as { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
    const idle = ric ? ric(fire, { timeout: 3500 }) : window.setTimeout(fire, 3500);

    return () => {
      cleanup();
      if (typeof idle === "number") clearTimeout(idle);
    };
  }, []);

  return null;
}
