import 'server-only';
import { neon, neonConfig } from '@neondatabase/serverless';
import type { Logger } from 'drizzle-orm/logger';
import { drizzle } from 'drizzle-orm/neon-http';
import { env } from '@/lib/env/env.next';
import { log } from '@/lib/logger';

// Custom logger for Drizzle ORM to stream queries into pino logger
class DrizzleQueryLogger implements Logger {
	logQuery(query: string, params: unknown[]): void {
		// Exclude query logging in production to protect PII and database secrets
		if (env.NODE_ENV === 'development' || env.DEBUG_MODE) {
			log.debug('Database Query', { query, params });
		}
	}
}

if (typeof window === 'undefined' && !globalThis.WebSocket) {
	import('ws')
		.then((ws) => {
			neonConfig.webSocketConstructor = ws.default;
			log.debug('Neon WebSocket polyfill constructor successfully loaded');
		})
		.catch((error) => {
			log.error(
				'Failed to load WebSocket constructor polyfill for Neon client',
				{ err: error },
			);
		});
}

// Safely extract hostname for initialization logs
let dbHost = 'unknown';
try {
	dbHost = new URL(env.DATABASE_URL).hostname;
} catch {
	// Fallback in case of parsing exceptions
}

log.info('Initializing Neon database connection pooler', { host: dbHost });

const sql = neon(env.DATABASE_URL);

// Pass the configured client and logger into Drizzle
export const db = drizzle({
	client: sql,
	logger: new DrizzleQueryLogger(),
});
