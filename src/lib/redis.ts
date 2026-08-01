import { Redis } from "@upstash/redis";
import { env } from "@/lib/env/env.next";

export const redis = new Redis({
	url: env.KV_REST_API_URL || env.UPSTASH_REDIS_REST_URL || "",
	token: env.KV_REST_API_TOKEN || env.UPSTASH_REDIS_REST_TOKEN || "",
});
