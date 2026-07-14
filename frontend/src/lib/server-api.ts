/** Server-side backend URL for Next.js route handlers (order + OTP proxies). */
export function getServerApiUrl(): string {
  return (
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "https://api.lamsaglow.shop"
  );
}
