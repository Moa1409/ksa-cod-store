import { env } from "@/lib/env";

/** Snap pixel in initial HTML (TikTok is injected in layout <head>). */
export function HeadPixels() {
  if (!env.enablePixels || !env.snapPixelId) return null;
  const snapId = env.snapPixelId;

  return (
    <script
      id="snap-pixel-head"
      dangerouslySetInnerHTML={{
        __html: `(function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function(){a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};a.queue=[];var s="script";var r=t.createElement(s);r.async=!0;r.src=n;var u=t.getElementsByTagName(s)[0];u.parentNode.insertBefore(r,u);})(window,document,"https://sc-static.net/scevent.min.js");snaptr("init",${JSON.stringify(snapId)},{});snaptr("track","PAGE_VIEW");`,
      }}
    />
  );
}
