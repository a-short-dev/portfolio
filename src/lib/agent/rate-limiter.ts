import type { NextRequest } from "next/server";
import { redis } from "@/lib/redis";

export const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
export const MAX_REQUESTS_PER_WINDOW = 12;
export const MAX_MESSAGE_LENGTH = 600;
export const MIN_MESSAGE_LENGTH = 3;

export function getClientIP(request: NextRequest): string {
	const forwarded = request.headers.get("x-forwarded-for");
	const realIP = request.headers.get("x-real-ip");
	const remoteAddr = request.headers.get("remote-addr");

	if (forwarded) return forwarded.split(",")[0].trim();
	if (realIP) return realIP;
	if (remoteAddr) return remoteAddr;
	return "unknown";
}

/**
 * Checks if a client is rate limited using Redis.
 * Supports customizing keys, limits, and window sizes.
 */
export async function isRateLimited(
	clientIP: string,
	actionKey = "chat",
	limit = MAX_REQUESTS_PER_WINDOW,
	windowMs = RATE_LIMIT_WINDOW
): Promise<boolean> {
	// Skip rate limit checks in local development if redis is not configured
	if (!process.env.KV_REST_API_URL && process.env.NODE_ENV === "development") {
		return false;
	}

	const key = `rate_limit:${actionKey}:${clientIP}`;

	try {
		const count = await redis.incr(key);
		if (count === 1) {
			await redis.expire(key, Math.ceil(windowMs / 1000));
		}
		return count > limit;
	} catch (error) {
		console.error(`Rate limiting error for key ${key}:`, error);
		// Fail-open: allow request if redis fails to avoid blocking legitimate traffic
		return false;
	}
}
