import type { NetworkError } from './network-error';

export type HttpMethod =
	| 'GET'
	| 'POST'
	| 'PUT'
	| 'PATCH'
	| 'DELETE'
	| 'HEAD'
	| 'OPTIONS'
	| 'QUERY';

export type HttpMethodInput = HttpMethod | Lowercase<HttpMethod>;

export type QueryParamValue =
	| string
	| number
	| boolean
	| null
	| undefined
	| Array<string | number | boolean>;

export type ExtractPathParams<S extends string> =
	string extends S
		? Record<string, string | number>
		: S extends `${string}{${infer Param}}${infer Rest}`
			? { [K in Param | keyof ExtractPathParams<Rest>]: string | number }
			: never;

/**
 * `Extra` is the deliberate, typed escape hatch. Instead of a blanket
 * index signature, callers declare what protocol-specific shape they need
 * (e.g. gRPC metadata) and get it type-checked, rather than `unknown` fields
 * type-checking against anything.
 */
export interface NetworkRequest<B = unknown, Extra extends object = {}, U extends string = string> {
	/** May contain `{token}` placeholders resolved via `pathParams`, e.g. '/users/{id}'. */
	url: U;
	method?: HttpMethodInput;
	headers?: Record<string, string>;
	/** Resolved into `url` before query params are appended. */
	pathParams?: ExtractPathParams<U>;
	params?: Record<string, QueryParamValue>;
	body?: B;
	signal?: AbortSignal;
	timeoutMs?: number;
	extra?: Extra;
	/** Per-call override for CacheAdapter. Ignored if no CacheAdapter is in the chain. */
	cache?: { bypass?: boolean; ttlMs?: number; key?: string };
	responseType?: 'json' | 'text' | 'stream' | 'blob' | 'arraybuffer';
	onUploadProgress?: (progress: { loaded: number; total?: number }) => void;
}

export interface NetworkResponse<
	T = unknown,
	B = unknown,
	Extra extends object = {},
> {
	data: T;
	status: number;
	statusText: string;
	headers: Record<string, string>;
	config: NetworkRequest<B, Extra, string>;
	raw?: unknown;
}

/**
 * Generic lives on the ADAPTER, not on each call. A FetchAdapter declares
 * up front what Extra shape it understands; you can't ask it for a call
 * shape it was never built to support.
 */
export interface TransportAdapter<Extra extends object = {}> {
	execute<T = unknown, B = unknown>(
		request: NetworkRequest<B, Extra, string>,
	): Promise<NetworkResponse<T, B, Extra>>;
}

export interface NetworkPlugin<Extra extends object = {}> {
	preRequest?<B>(
		request: NetworkRequest<B, Extra>,
	): Promise<NetworkRequest<B, Extra>> | NetworkRequest<B, Extra>;
	postResponse?<T, B>(
		response: NetworkResponse<T, B, Extra>,
	): Promise<NetworkResponse<T, B, Extra>> | NetworkResponse<T, B, Extra>;
	onError?<B>(error: NetworkError<B, Extra>): Promise<void> | void;
}
