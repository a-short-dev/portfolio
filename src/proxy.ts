import { type NextRequest, NextResponse } from 'next/server';
import { DOMAINS } from '@/lib/constants';

const ALLOWED_ORIGINS = [
	DOMAINS.canonical,
	`https://www.${DOMAINS.canonical.replace('https://', '')}`,
	DOMAINS.vercel,
];
const PROTECTED_ROUTES = ['/admin'];

export function proxy(req: NextRequest) {
	// 1. Header Spoofing Protection
	const forbiddenHeaders = [
		'x-middleware-subrequest',
		'x-middleware-invoke',
		'x-middleware-prefetch',
	];

	for (const header of forbiddenHeaders) {
		if (req.headers.has(header)) {
			return new NextResponse(
				`Bad Request: Forbidden internal header '${header}' spoofing detected.`,
				{ status: 400 },
			);
		}
	}

	const { pathname } = req.nextUrl;
	const isDev = process.env.NODE_ENV === 'development';
	const sessionCookies = req.cookies.get('session')?.value;

	// 2. Auth Guard & Redirects
	const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
		pathname.startsWith(route),
	);

	if (isProtectedRoute && !sessionCookies) {
		return NextResponse.redirect(new URL('/login', req.url));
	}

	if (pathname.startsWith('/login') && sessionCookies) {
		return NextResponse.redirect(new URL(PROTECTED_ROUTES[0], req.url));
	}

	// 3. CORS Preflight & API Protection
	const origin = req.headers.get('origin');
	const isAllowedOrigin =
		origin &&
		(ALLOWED_ORIGINS.includes(origin) ||
			(isDev && /^https?:\/\/localhost(:\d+)?$/.test(origin)));

	if (pathname.startsWith('/api')) {
		const response =
			req.method === 'OPTIONS'
				? new NextResponse(null, { status: 200 })
				: NextResponse.next();

		if (isAllowedOrigin) {
			response.headers.set('Access-Control-Allow-Origin', origin);
			response.headers.set('Access-Control-Allow-Credentials', 'true');
			response.headers.set(
				'Access-Control-Allow-Headers',
				'Content-Type, Authorization, X-Requested-With, X-Nonce',
			);
			response.headers.set(
				'Access-Control-Allow-Methods',
				'GET, POST, PUT, DELETE, OPTIONS',
			);
			if (req.method === 'OPTIONS') {
				response.headers.set('Access-Control-Max-Age', '86400');
			}
		}
		return response;
	}

	// 4. CSP & Security Headers for Web Routes
	const nonce = crypto.randomUUID();
	const scriptSrc = isDev
		? "'unsafe-inline' 'unsafe-eval'"
		: `'nonce-${nonce}' 'strict-dynamic'`;

	const csp = `
    default-src 'self';
    script-src 'self' va.vercel-scripts.com ${scriptSrc};
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: blob: https://i.scdn.co https://*.scdn.co;
    font-src 'self';
    connect-src 'self' https://*.vercel-insights.com https://vitals.vercel-analytics.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
  `
		.replace(/\s{2,}/g, ' ')
		.trim();

	const requestHeaders = new Headers(req.headers);
	if (!isDev) {
		requestHeaders.set('x-nonce', nonce);
	}

	const response = NextResponse.next({
		request: { headers: requestHeaders },
	});

	response.headers.set('Content-Security-Policy', csp);
	response.headers.set('X-Frame-Options', 'DENY');
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	response.headers.set('X-DNS-Prefetch-Control', 'on');
	response.headers.set(
		'Permissions-Policy',
		'camera=(), microphone=(), geolocation=()',
	);
	response.headers.set(
		'Strict-Transport-Security',
		'max-age=31536000; includeSubDomains; preload',
	);

	if (!isDev) {
		response.headers.set('x-nonce', nonce);
	}

	return response;
}

export const config = {
	matcher: [
		'/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
	],
};
