import { NetworkError } from './network-error';
import { type ResponseValidator, validateResponse } from './network-validation';
import type {
	NetworkPlugin,
	NetworkRequest,
	NetworkResponse,
	TransportAdapter,
} from './types';

type CallOptions<B, Extra extends object, T, U extends string> = Omit<
	NetworkRequest<B, Extra, U>,
	'url' | 'method' | 'body'
> & { schema?: ResponseValidator<T> };

// ---------------------------------------------------------------------------
// RetryAdapter — decorator, not a plugin. Retrying means re-running execute()
// itself, which a single-call plugin hook can't do. Wrapping the adapter
// keeps this composable: RetryAdapter wraps FetchAdapter, and to everything
// above it (runPipeline, other decorators) it's just another TransportAdapter.
// ---------------------------------------------------------------------------

export interface RetryPolicy {
	maxAttempts?: number; // total attempts including the first, default 3
	baseDelayMs?: number; // default 250
	maxDelayMs?: number; // default 4000
	/** Return true if this error should trigger a retry. Defaults to: network
	 *  errors (no status) or 5xx responses. 4xx is treated as non-retryable. */
	shouldRetry?: (
		error: NetworkError<unknown, object>,
		attempt: number,
	) => boolean;
}

function defaultShouldRetry(error: NetworkError<unknown, object>): boolean {
	if (error.status === undefined) return true; // network failure / timeout
	return error.status >= 500;
}

function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export class RetryAdapter<Extra extends object = {}>
	implements TransportAdapter<Extra>
{
	constructor(
		private readonly inner: TransportAdapter<Extra>,
		private readonly policy: RetryPolicy = {},
	) {}

	async execute<T = unknown, B = unknown>(
		request: NetworkRequest<B, Extra, string>,
	): Promise<NetworkResponse<T, B, Extra>> {
		const maxAttempts = this.policy.maxAttempts ?? 3;
		const baseDelayMs = this.policy.baseDelayMs ?? 250;
		const maxDelayMs = this.policy.maxDelayMs ?? 4000;
		const shouldRetry = this.policy.shouldRetry ?? defaultShouldRetry;

		let lastError: NetworkError<B, Extra> | undefined;

		for (let attempt = 1; attempt <= maxAttempts; attempt++) {
			try {
				return await this.inner.execute<T, B>(request);
			} catch (err) {
				const netErr =
					err instanceof NetworkError
						? err
						: new NetworkError<B, Extra>((err as Error).message, request, {
								cause: err,
							});
				lastError = netErr;

				const isLastAttempt = attempt === maxAttempts;
				if (isLastAttempt || !shouldRetry(netErr, attempt)) {
					throw netErr;
				}

				const backoff = Math.min(baseDelayMs * 2 ** (attempt - 1), maxDelayMs);
				const jitter = Math.random() * backoff * 0.2;
				await delay(backoff + jitter);
			}
		}

		// Unreachable given loop above, but keeps TS happy.
		throw lastError;
	}
}

// ---------------------------------------------------------------------------
// Advanced Auth Plugin
// ---------------------------------------------------------------------------

export type AuthStrategy =
	| { type: 'bearer' }
	| { type: 'basic' }
	| { type: 'query'; key: string }
	| { type: 'header'; name: string; prefix?: string }
	| { type: 'custom'; inject: <B, Extra extends object>(req: NetworkRequest<B, Extra, string>, token: string) => NetworkRequest<B, Extra, string> };

export interface AuthPluginOptions {
	getToken: () => string | undefined | Promise<string | undefined>;
	strategy?: AuthStrategy; // default: { type: 'bearer' }
}

export function authPlugin(options: AuthPluginOptions): NetworkPlugin {
	const strategy = options.strategy ?? { type: 'bearer' };

	return {
		async preRequest(request) {
			const token = await options.getToken();
			if (!token) return request;

			const headers = request.headers ?? {};

			switch (strategy.type) {
				case 'bearer':
					return {
						...request,
						headers: { ...headers, Authorization: `Bearer ${token}` },
					};
				case 'basic':
					return {
						...request,
						headers: { ...headers, Authorization: `Basic ${token}` },
					};
				case 'query':
					return {
						...request,
						params: { ...(request.params ?? {}), [strategy.key]: token },
					};
				case 'header':
					return {
						...request,
						headers: { ...headers, [strategy.name]: `${strategy.prefix ?? ''}${token}` },
					};
				case 'custom':
					return strategy.inject(request, token);
				default:
					return request;
			}
		},
	};
}

export interface LoggingPluginOptions {
	log?: (msg: string, ctx?: unknown) => void;
	error?: (msg: string, ctx?: unknown) => void;
}

export function loggingPlugin(
	label = 'network',
	options?: LoggingPluginOptions,
): NetworkPlugin {
	const logInfo = options?.log ?? console.log;
	const logError = options?.error ?? console.error;

	return {
		preRequest(request) {
			logInfo(
				`[${label}] -> ${(request.method ?? 'GET').toString().toUpperCase()} ${request.url}`,
			);
			return request;
		},
		postResponse(response) {
			logInfo(`[${label}] <- ${response.status} ${response.config.url}`);
			return response;
		},
		onError(error) {
			logError(`[${label}] x ${error.config.url}: ${error.message}`, {
				err: error,
			});
		},
	};
}

// ---------------------------------------------------------------------------
// NetworkClient — thin ergonomic wrapper so callers don't touch runPipeline
// directly for every call.
// ---------------------------------------------------------------------------
// Runtime Interceptors Manager
// ---------------------------------------------------------------------------

export class InterceptorsManager<T> {
	private handlers: T[] = [];

	use(handler: T): () => void {
		this.handlers.push(handler);
		return () => {
			this.handlers = this.handlers.filter((h) => h !== handler);
		};
	}

	get(): T[] {
		return [...this.handlers];
	}
}

export class NetworkClient<Extra extends object = {}> {
	readonly interceptors = {
		request: new InterceptorsManager<
			(req: NetworkRequest<any, Extra, string>) => Promise<NetworkRequest<any, Extra, string>> | NetworkRequest<any, Extra, string>
		>(),
		response: new InterceptorsManager<
			(res: NetworkResponse<any, any, Extra>) => Promise<NetworkResponse<any, any, Extra>> | NetworkResponse<any, any, Extra>
		>(),
	};

	constructor(
		private readonly adapter: TransportAdapter<Extra>,
		private readonly plugins: NetworkPlugin<Extra>[] = [],
	) {}

	async request<T = unknown, B = unknown, U extends string = string>(
		req: NetworkRequest<B, Extra, U>,
		schema?: ResponseValidator<T>,
	): Promise<NetworkResponse<T, B, Extra>> {
		let requestConfig = req as unknown as NetworkRequest<B, Extra, string>;

		// 1. Run pipeline plugins preRequest hooks
		for (const plugin of this.plugins) {
			if (plugin.preRequest) {
				requestConfig = await plugin.preRequest<B>(requestConfig);
			}
		}

		// 2. Run dynamic request interceptors
		for (const interceptor of this.interceptors.request.get()) {
			requestConfig = await interceptor(requestConfig);
		}

		try {
			// 3. Execute adapter
			let response = await this.adapter.execute<T, B>(requestConfig);

			// 4. Run dynamic response interceptors
			for (const interceptor of this.interceptors.response.get()) {
				response = await interceptor(response);
			}

			// 5. Run pipeline plugins postResponse hooks
			for (const plugin of this.plugins) {
				if (plugin.postResponse) {
					response = await plugin.postResponse<T, B>(response);
				}
			}

			if (!schema) return response;
			return { ...response, data: validateResponse(schema, response.data, requestConfig as unknown as NetworkRequest<unknown, object, string>) };
		} catch (err) {
			const netErr =
				err instanceof NetworkError
					? err
					: new NetworkError<B, Extra>((err as Error).message, requestConfig, {
							cause: err,
						});

			// Run error hooks in plugins
			for (const plugin of this.plugins) {
				if (plugin.onError) {
					await plugin.onError<B>(netErr);
				}
			}
			throw netErr;
		}
	}

	get<T = unknown, U extends string = string>(url: U, opts?: CallOptions<never, Extra, T, U>) {
		const { schema, ...req } = opts ?? {};
		return this.request<T, never, U>({ ...req, url, method: 'GET' } as unknown as NetworkRequest<never, Extra, U>, schema);
	}

	post<T = unknown, B = unknown, U extends string = string>(
		url: U,
		body: B,
		opts?: CallOptions<B, Extra, T, U>,
	) {
		const { schema, ...req } = opts ?? {};
		return this.request<T, B, U>({ ...req, url, method: 'POST', body } as unknown as NetworkRequest<B, Extra, U>, schema);
	}

	put<T = unknown, B = unknown, U extends string = string>(
		url: U,
		body: B,
		opts?: CallOptions<B, Extra, T, U>,
	) {
		const { schema, ...req } = opts ?? {};
		return this.request<T, B, U>({ ...req, url, method: 'PUT', body } as unknown as NetworkRequest<B, Extra, U>, schema);
	}

	patch<T = unknown, B = unknown, U extends string = string>(
		url: U,
		body: B,
		opts?: CallOptions<B, Extra, T, U>,
	) {
		const { schema, ...req } = opts ?? {};
		return this.request<T, B, U>({ ...req, url, method: 'PATCH', body } as unknown as NetworkRequest<B, Extra, U>, schema);
	}

	delete<T = unknown, U extends string = string>(url: U, opts?: CallOptions<never, Extra, T, U>) {
		const { schema, ...req } = opts ?? {};
		return this.request<T, never, U>({ ...req, url, method: 'DELETE' } as unknown as NetworkRequest<never, Extra, U>, schema);
	}
}

// ---------------------------------------------------------------------------
// Usage example
// ---------------------------------------------------------------------------

/*
import { FetchAdapter } from './network-core';
import { RetryAdapter, authPlugin, loggingPlugin, NetworkClient } from './network-plugins';

const base = new FetchAdapter({ baseUrl: 'https://api.example.com', defaultTimeoutMs: 8000 });
const resilient = new RetryAdapter(base, { maxAttempts: 3 });

const client = new NetworkClient(resilient, [
  authPlugin(() => getStoredToken()),
  loggingPlugin('api'),
]);

interface User { id: string; name: string }

const res = await client.get<User>('/users/42');
console.log(res.data.name);

const created = await client.post<User, { name: string }>('/users', { name: 'Ada' });
*/
