import { z } from 'zod';

// 1. Define server-side environment variable schemas
export const serverSchema = z.object({
	NODE_ENV: z
		.enum(['development', 'production', 'test'])
		.default('development'),
	LOG_LEVEL: z
		.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal', 'silent'])
		.default('info'),
	DATABASE_URL: z.url('DATABASE_URL must be a valid connection URL'),
	CHAT_ENCRYPTION_KEY: z
		.string()
		.length(64, 'CHAT_ENCRYPTION_KEY must be exactly 64 characters')
		.optional()
		.or(z.literal('')),
	DEBUG_MODE: z
		.preprocess((val) => val === 'true' || val === true, z.boolean())
		.default(false),
	OPENROUTER_API_KEY: z.string().min(1, 'OPENROUTER_API_KEY is required'),
	OWNER_SECRET_KEY: z.string().min(1, 'OWNER_SECRET_KEY is required'),
	SPOTIFY_CLIENT_SECRET: z.string().min(1, 'SPOTIFY_CLIENT_SECRET is required'),
	SPOTIFY_REFRESH_TOKEN: z.string().optional(),
	RESEND_API_KEY: z.string().min(1, 'RESEND_API_KEY is required'),
	KV_REST_API_URL: z.url().optional().or(z.literal('')),
	KV_REST_API_TOKEN: z.string().optional().or(z.literal('')),
	UPSTASH_REDIS_REST_URL: z.url().optional().or(z.literal('')),
	UPSTASH_REDIS_REST_TOKEN: z.string().optional().or(z.literal('')),
});

// 2. Define client-safe environment variable schemas (must start with NEXT_PUBLIC_)
export const clientSchema = z.object({
	NEXT_PUBLIC_VERCEL_ENV: z
		.enum(['production', 'preview', 'development'])
		.optional(),
	NEXT_PUBLIC_SITE_URL: z.url().optional().or(z.literal('')),
	NEXT_PUBLIC_SPOTIFY_CLIENT_ID: z
		.string()
		.min(1, 'NEXT_PUBLIC_SPOTIFY_CLIENT_ID is required'),
	NEXT_PUBLIC_SPOTIFY_REDIRECT_URI: z
		.string()
		.min(1, 'NEXT_PUBLIC_SPOTIFY_REDIRECT_URI is required')
		.default('http://localhost:3110/api/spotify/callback'),
});

// 3. Extend combined schemas for overall validation
export const combinedSchema = serverSchema.extend(clientSchema.shape);

// 4. Define types
export type ServerEnv = z.infer<typeof serverSchema>;
export type ClientEnv = z.infer<typeof clientSchema>;
export type Env = z.infer<typeof combinedSchema>;
