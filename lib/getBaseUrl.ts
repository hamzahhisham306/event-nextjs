// lib/getBaseUrl.ts
export function getBaseUrl() {
  // لو حاطط القيمة يدوياً بالـ env، استخدمها
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
  // على الإنتاج (production) بفيرسل
  if (process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  // preview deployments
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }
  // fallback للتطوير المحلي
  return "http://localhost:3000";
}