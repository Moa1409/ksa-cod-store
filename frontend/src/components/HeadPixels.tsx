import Script from "next/script";
import { env } from "@/lib/env";

/**
 * Inject TikTok + Snap base pixels in the document early so Pixel Helper
 * and ad platforms can detect them (not only after React hydration).
 * Meta stays in client initPixels (same pattern, optional).
 */
export function HeadPixels() {
  if (!env.enablePixels) return null;

  return (
    <>
      {env.tiktokPixelId ? (
        <Script id="tiktok-pixel" strategy="afterInteractive">{`
!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];
  ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"];
  ttq.setAndDefer=function(obj,method){obj[method]=function(){obj.push([method].concat(Array.prototype.slice.call(arguments,0)))}};
  for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
  ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=d.createElement("script");
  o.type="text/javascript";o.async=!0;o.src=r+"?sdkid="+e+"&lib="+t;
  var a=d.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a);
  ttq._i=ttq._i||{};ttq._i[e]=[];ttq._i[e]._u=r;ttq._t=ttq._t||{};ttq._t[e]=+new Date;ttq._o=ttq._o||{};ttq._o[e]=n||{}};
  ttq.load(${JSON.stringify(env.tiktokPixelId)});
  ttq.page();
}(window, document, "ttq");
`}
        </Script>
      ) : null}

      {env.snapPixelId ? (
        <Script id="snap-pixel" strategy="afterInteractive">{`
(function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function(){a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};
a.queue=[];var s="script";var r=t.createElement(s);r.async=!0;r.src=n;
var u=t.getElementsByTagName(s)[0];u.parentNode.insertBefore(r,u);})(window,document,"https://sc-static.net/scevent.min.js");
snaptr("init", ${JSON.stringify(env.snapPixelId)}, {});
snaptr("track", "PAGE_VIEW");
`}
        </Script>
      ) : null}
    </>
  );
}
