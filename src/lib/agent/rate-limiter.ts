import type { NextRequest } from "next/server";

export const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
export const MAX_REQUESTS_PER_WINDOW = 12;
export const MAX_MESSAGE_LENGTH = 600;
export const MIN_MESSAGE_LENGTH = 3;

const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  const remoteAddr = request.headers.get("remote-addr");

  if (forwarded) return forwarded.split(",")[0].trim();
  if (realIP) return realIP;
  if (remoteAddr) return remoteAddr;
  return "unknown";
}

export function isRateLimited(clientIP: string): boolean {
  const now = Date.now();
  const clientData = requestCounts.get(clientIP);

  if (!clientData || now > clientData.resetTime) {
    requestCounts.set(clientIP, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return false;
  }

  if (clientData.count >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }

  clientData.count++;
  return false;
}
