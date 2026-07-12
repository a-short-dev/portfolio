import { type NextRequest, NextResponse } from "next/server";
import { DOMAINS } from "@/lib/constants";

// Allowlist of trusted origins for API requests requiring credentials
const ALLOWED_ORIGINS = [
  DOMAINS.canonical,
  `https://www.${DOMAINS.canonical.replace("https://", "")}`,
  DOMAINS.vercel,
];

export function proxy(req: NextRequest) {
  const forbiddenHeaders = [
    "x-middleware-subrequest",
    "x-middleware-invoke",
    "x-middleware-prefetch",
  ];

  for (const header of forbiddenHeaders) {
    if (req.headers.has(header)) {
      return new NextResponse(
        `Bad Request: Forbidden internal header '${header}' spoofing detected.`,
        { status: 400 },
      );
    }
  }

  const isDev = process.env.NODE_ENV === "development";
  const url = req.nextUrl;
  const origin = req.headers.get("origin");

  // Allow localhost origins dynamically in development mode
  const isAllowedOrigin =
    origin &&
    (ALLOWED_ORIGINS.includes(origin) ||
      (isDev && origin.match(/^https?:\/\/localhost(:\d+)?$/)));

  // ── CORS & Credentials Protection for API/Secure Routes ──
  if (url.pathname.startsWith("/api")) {
    // 1. Preflight OPTIONS Request Handling
    if (req.method === "OPTIONS") {
      const response = new NextResponse(null, { status: 200 });
      if (isAllowedOrigin) {
        response.headers.set("Access-Control-Allow-Origin", origin);
        response.headers.set("Access-Control-Allow-Credentials", "true");
        response.headers.set(
          "Access-Control-Allow-Headers",
          "Content-Type, Authorization, X-Requested-With, X-Nonce",
        );
        response.headers.set(
          "Access-Control-Allow-Methods",
          "GET, POST, PUT, DELETE, OPTIONS",
        );
        response.headers.set("Access-Control-Max-Age", "86400"); // 24 hours cache
      }
      return response;
    }

    // 2. Regular API Request CORS Headers Injection
    const response = NextResponse.next();
    if (isAllowedOrigin) {
      response.headers.set("Access-Control-Allow-Origin", origin);
      response.headers.set("Access-Control-Allow-Credentials", "true");
      response.headers.set(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, X-Requested-With, X-Nonce",
      );
      response.headers.set(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS",
      );
    }
    return response;
  }

  // ── Standard Web/Page Security Policies (CSP, Nonces) ──
  const nonce = crypto.randomUUID();

  const csp = `
    default-src 'self';
    script-src 'self' ${isDev ? "'unsafe-inline' 'unsafe-eval'" : `'nonce-${nonce}'`};
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: blob: https://i.scdn.co https://*.scdn.co;
    font-src 'self';
    connect-src 'self' https://*.vercel-insights.com https://vitals.vercel-analytics.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
  `
    .replace(/\s{2,}/g, " ")
    .trim();

  const requestHeaders = new Headers(req.headers);

  if (!isDev) {
    requestHeaders.set("x-nonce", nonce);
  }

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Security Headers
  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-DNS-Prefetch-Control", "on");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload",
  );

  return response;
}

export const config = {
  matcher: [
    // Intercept all paths including API routes but excluding static assets
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
