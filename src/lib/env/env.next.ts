import { clientSchema, combinedSchema, type Env } from './env';

const isServer = typeof window === 'undefined';

const parseEnv = (): Env => {
	if (isServer) {
		const parsed = combinedSchema.safeParse(process.env);
		if (!parsed.success) {
			const errorDetails = parsed.error.issues
				.map((i) => `  - ${i.path.join('.')}: ${i.message}`)
				.join('\n');

			const isProduction = process.env.NODE_ENV === 'production';
			if (process.env.SKIP_ENV_VALIDATION && !isProduction) {
				console.warn(
					`⚠️ Warning: Environment validation failed but SKIP_ENV_VALIDATION is enabled:\n${errorDetails}`,
				);
				// Parse through combinedSchema with minimal development defaults to ensure correct runtime types
				return combinedSchema.parse({
					...process.env,
					DATABASE_URL:
						process.env.DATABASE_URL || 'postgresql://localhost:5432/neondb',
					OPENROUTER_API_KEY:
						process.env.OPENROUTER_API_KEY || 'dev_dummy_openrouter_key',
					OWNER_SECRET_KEY:
						process.env.OWNER_SECRET_KEY || 'dev_dummy_owner_secret_key',
					SPOTIFY_CLIENT_SECRET:
						process.env.SPOTIFY_CLIENT_SECRET || 'dev_dummy_spotify_secret',
					RESEND_API_KEY: process.env.RESEND_API_KEY || 'dev_dummy_resend_key',
					NEXT_PUBLIC_SPOTIFY_CLIENT_ID:
						process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || 'dev_dummy_client_id',
				}) as Env;
			}

			throw new Error(`❌ Invalid environment variables:\n${errorDetails}`);
		}
		return parsed.data as Env;
	}

	// Client-side environment mapping:
	// Dynamically populate client fields from clientSchema keys to prevent code duplication
	const clientData: Record<string, unknown> = {};
	for (const key of Object.keys(clientSchema.shape)) {
		clientData[key] = process.env[key];
	}

	const parsed = clientSchema.safeParse(clientData);

	if (!parsed.success) {
		const errorDetails = parsed.error.issues
			.map((i) => `  - ${i.path.join('.')}: ${i.message}`)
			.join('\n');
		throw new Error(
			`❌ Client environment validation failed:\n${errorDetails}`,
		);
	}

	// Security Proxy: strictly prevents accessing server secrets on client side
	const clientAllowedKeys = new Set(Object.keys(clientSchema.shape));

	return new Proxy(parsed.data as Env, {
		get(target, prop: string) {
			if (
				typeof prop === 'string' &&
				!clientAllowedKeys.has(prop) &&
				!prop.startsWith('NEXT_PUBLIC_')
			) {
				throw new Error(
					`🚫 SECURITY VIOLATION: Accessing secret "${prop}" on client!`,
				);
			}
			return Reflect.get(target, prop);
		},
	});
};

export const env = parseEnv();
export type { Env };
