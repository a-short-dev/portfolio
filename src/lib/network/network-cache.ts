import type {
	HttpMethod,
	NetworkRequest,
	NetworkResponse,
	TransportAdapter,
} from './types';

// ---------------------------------------------------------------------------
// CacheAdapter — another decorator, same pattern as RetryAdapter. Caching
// wraps execute() the same way retrying does: it needs to intercept the
// call and sometimes skip it entirely, which a single-shot plugin hook
// can't express.
// ---------------------------------------------------------------------------

interface CacheEntry {
	expiresAt: number;
	response: NetworkResponse<unknown, unknown, object>;
}

export interface CacheAdapterOptions {
	ttlMs?: number; // default 30_000
	methods?: HttpMethod[]; // default ['GET'] — only these are cached
	keyFn?: (request: NetworkRequest<unknown, object>) => string;
}

function defaultKey(request: NetworkRequest<unknown, object>): string {
	const method = (request.method ?? 'GET').toString().toUpperCase();
	// Note: deliberately excludes headers from the key. If responses vary by
	// auth identity (e.g. per-user data behind the same URL), pass a keyFn
	// that folds the relevant header/claim into the key.
	return `${method} ${request.url} ${JSON.stringify(request.params ?? {})}`;
}

export class CacheAdapter<Extra extends object = {}>
	implements TransportAdapter<Extra>
{
	private readonly store = new Map<string, CacheEntry>();
	private readonly inFlight = new Map<
		string,
		Promise<NetworkResponse<unknown, unknown, object>>
	>();
	private readonly methods: HttpMethod[];

	constructor(
		private readonly inner: TransportAdapter<Extra>,
		private readonly options: CacheAdapterOptions = {},
	) {
		this.methods = options.methods ?? ['GET'];
	}

	async execute<T = unknown, B = unknown>(
		request: NetworkRequest<B, Extra>,
	): Promise<NetworkResponse<T, B, Extra>> {
		const method = (request.method ?? 'GET')
			.toString()
			.toUpperCase() as HttpMethod;
		const cacheable = this.methods.includes(method) && !request.cache?.bypass;

		if (!cacheable) {
			return this.inner.execute<T, B>(request);
		}

		const key =
			request.cache?.key ??
			this.options.keyFn?.(request) ??
			defaultKey(request);
		const now = Date.now();

		const cached = this.store.get(key);
		if (cached && cached.expiresAt > now) {
			return cached.response as NetworkResponse<T, B, Extra>;
		}

		// Dedupe concurrent identical calls (e.g. two components requesting the
		// same resource on mount) instead of firing the request twice.
		const pending = this.inFlight.get(key);
		if (pending) {
			return pending as Promise<NetworkResponse<T, B, Extra>>;
		}

		const ttlMs = request.cache?.ttlMs ?? this.options.ttlMs ?? 30_000;
		const promise = this.inner
			.execute<T, B>(request)
			.then((response) => {
				this.store.set(key, { expiresAt: Date.now() + ttlMs, response });
				return response;
			})
			.finally(() => {
				this.inFlight.delete(key);
			});

		this.inFlight.set(key, promise);
		return promise;
	}

	/** Invalidate one entry (e.g. after a mutation) or, with no args, everything. */
	invalidate(request?: NetworkRequest<unknown, object>): void {
		if (!request) {
			this.store.clear();
			return;
		}
		const key =
			request.cache?.key ??
			this.options.keyFn?.(request) ??
			defaultKey(request);
		this.store.delete(key);
	}

	/** Invalidate all keys whose default/custom key contains a substring — useful for
	 *  clearing a whole resource family, e.g. invalidateMatching('/users'). */
	invalidateMatching(substring: string): void {
		for (const key of this.store.keys()) {
			if (key.includes(substring)) this.store.delete(key);
		}
	}
}
