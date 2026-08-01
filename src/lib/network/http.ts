import type { CustomLogger } from '@/lib/logger';
import { FetchAdapter, type FetchAdapterOptions } from './network-core';
import {
	loggingPlugin,
	NetworkClient,
	RetryAdapter,
	type RetryPolicy,
} from './network-plugin';
import type { NetworkPlugin } from './types';

let serverLog: CustomLogger | undefined;

if (typeof window === 'undefined') {
	import('@/lib/logger')
		.then((m) => { serverLog = m.log; })
		.catch(() => {});
}

export const runtimeLogger = {
	log: (msg: string, ctx?: unknown) =>
		serverLog
			? serverLog.info(msg, ctx as Record<string, unknown>)
			: console.log(msg, ctx),
	error: (msg: string, ctx?: unknown) =>
		serverLog
			? serverLog.error(msg, ctx as Record<string, unknown>)
			: console.error(msg, ctx),
};

export interface CreateClientOptions {
	baseUrl?: string;
	timeoutMs?: number;
	retry?: RetryPolicy;
	plugins?: NetworkPlugin[];
	label?: string;
}

/**
 * Create a fully configured NetworkClient.
 *
 * @example — scoped client for a third-party API:
 * const stripe = createHttpClient({ baseUrl: 'https://api.stripe.com/v1', label: 'stripe' });
 */
export function createHttpClient(options: CreateClientOptions = {}): NetworkClient {
	const {
		baseUrl = resolveBaseUrl(),
		timeoutMs = 10_000,
		retry,
		plugins = [],
		label = 'http',
	} = options;

	const adapter = new RetryAdapter(
		new FetchAdapter({ baseUrl, defaultTimeoutMs: timeoutMs } satisfies FetchAdapterOptions),
		retry ?? { maxAttempts: 3, baseDelayMs: 300 },
	);

	return new NetworkClient(adapter, [
		loggingPlugin(label, runtimeLogger),
		...plugins,
	]);
}

function resolveBaseUrl(): string {
	if (typeof window !== 'undefined') return window.location.origin;
	return process.env.NEXT_PUBLIC_SITE_URL ?? '';
}

export const http = createHttpClient({ label: 'http' });
