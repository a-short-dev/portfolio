import {
	ForbiddenError,
	InternalServerError,
	NetworkError,
	NotFoundError,
	RateLimitError,
	UnauthorizedError,
} from './network-error';

function createNetworkError<B, Extra extends object>(
	status: number,
	message: string,
	request: NetworkRequest<B, Extra, string>,
	cause?: unknown,
): NetworkError<B, Extra> {
	switch (status) {
		case 401:
			return new UnauthorizedError(message, request, { cause });
		case 403:
			return new ForbiddenError(message, request, { cause });
		case 404:
			return new NotFoundError(message, request, { cause });
		case 429:
			return new RateLimitError(message, request, { cause });
		default:
			if (status >= 500) {
				return new InternalServerError(message, request, { status, cause });
			}
			return new NetworkError(message, request, { status, cause });
	}
}

import type {
	NetworkPlugin,
	NetworkRequest,
	NetworkResponse,
	QueryParamValue,
	TransportAdapter,
} from './types';

// ---------------------------------------------------------------------------
// Pipeline executor — threads B/T through pre -> execute -> post in one call
// so plugin ordering can't silently desync types at each stage.
// ---------------------------------------------------------------------------

export async function runPipeline<T, B, Extra extends object = {}>(
	adapter: TransportAdapter<Extra>,
	plugins: NetworkPlugin<Extra>[],
	request: NetworkRequest<B, Extra>,
): Promise<NetworkResponse<T, B, Extra>> {
	let req = request;
	for (const plugin of plugins) {
		if (plugin.preRequest) req = await plugin.preRequest<B>(req);
	}

	try {
		let res = await adapter.execute<T, B>(req);
		for (const plugin of plugins) {
			if (plugin.postResponse) res = await plugin.postResponse<T, B>(res);
		}
		return res;
	} catch (err) {
		const netErr =
			err instanceof NetworkError
				? err
				: new NetworkError<B, Extra>((err as Error).message, req, {
						cause: err,
					});
		for (const plugin of plugins) {
			if (plugin.onError) await plugin.onError<B>(netErr);
		}
		throw netErr;
	}
}

// ---------------------------------------------------------------------------
// Fetch adapter
// ---------------------------------------------------------------------------

/**
 * Resolves `{token}` placeholders in a URL against pathParams. Deliberately
 * uses curly braces rather than `:token` (Express-style) to avoid ambiguity
 * with the colon in `https://host:3000`.
 */
function interpolatePath<B, Extra extends object>(
	request: NetworkRequest<B, Extra>,
): string {
	const { url, pathParams } = request;
	if (!pathParams) return url;
	return url.replace(/\{(\w+)\}/g, (match, key) => {
		if (!(key in pathParams)) {
			throw new NetworkError(`Missing path param "${key}" for ${url}`, request);
		}
		return encodeURIComponent(String(pathParams[key]));
	});
}

function serializeParams(params?: Record<string, QueryParamValue>): string {
	if (!params) return '';
	const search = new URLSearchParams();
	for (const [key, value] of Object.entries(params)) {
		if (value === null || value === undefined) continue;
		if (Array.isArray(value)) {
			for (const v of value) search.append(key, String(v));
		} else {
			search.append(key, String(value));
		}
	}
	const qs = search.toString();
	return qs ? `?${qs}` : '';
}

function normalizeHeaders(headers: Headers): Record<string, string> {
	const out: Record<string, string> = {};
	headers.forEach((value, key) => {
		out[key] = value;
	});
	return out;
}

export interface FetchAdapterOptions {
	baseUrl?: string;
	defaultTimeoutMs?: number;
}

export class FetchAdapter<Extra extends object = {}>
	implements TransportAdapter<Extra>
{
	constructor(private readonly options: FetchAdapterOptions = {}) {}

	async execute<T = unknown, B = unknown>(
		request: NetworkRequest<B, Extra>,
	): Promise<NetworkResponse<T, B, Extra>> {
		const resolvedPath = interpolatePath(request);
		const url =
			(this.options.baseUrl ?? '') +
			resolvedPath +
			serializeParams(request.params);
		const method = (request.method ?? 'GET').toString().toUpperCase();

		const controller = new AbortController();
		const timeoutMs = request.timeoutMs ?? this.options.defaultTimeoutMs;
		const timeout = timeoutMs
			? setTimeout(() => controller.abort(), timeoutMs)
			: undefined;

		let onAbort: (() => void) | undefined;
		if (request.signal) {
			onAbort = () => controller.abort();
			request.signal.addEventListener('abort', onAbort);
		}

		const hasBody =
			request.body !== undefined && method !== 'GET' && method !== 'HEAD';

		let requestBody: BodyInit | undefined = hasBody
			? JSON.stringify(request.body)
			: undefined;

		// Stream-based upload progress wrapping
		if (hasBody && requestBody && request.onUploadProgress) {
			const encoder = new TextEncoder();
			const bytes =
				typeof requestBody === 'string'
					? encoder.encode(requestBody)
					: (requestBody as Uint8Array);
			const total = bytes.byteLength;
			let loaded = 0;

			const stream = new ReadableStream({
				start(controller) {
					controller.enqueue(bytes);
					loaded += bytes.byteLength;
					request.onUploadProgress!({ loaded, total });
					controller.close();
				},
			});
			requestBody = stream as unknown as BodyInit;
		}

		try {
			const res = await fetch(url, {
				method,
				headers: {
					...(hasBody ? { 'Content-Type': 'application/json' } : {}),
					...(request.headers ?? {}),
				},
				body: requestBody,
				signal: controller.signal,
				...(requestBody instanceof ReadableStream ? { duplex: 'half' } : {}),
			} as RequestInit);

			const headers = normalizeHeaders(res.headers);
			const contentType = headers['content-type'] ?? '';

			let data: unknown;
			if (request.responseType === 'stream') {
				data = res.body;
			} else if (res.status !== 204 && res.status !== 205) {
				if (request.responseType === 'text') {
					data = await res.text().catch(() => undefined);
				} else if (request.responseType === 'blob') {
					data = await res.blob().catch(() => undefined);
				} else if (request.responseType === 'arraybuffer') {
					data = await res.arrayBuffer().catch(() => undefined);
				} else if (
					request.responseType === 'json' ||
					(!request.responseType && contentType.includes('application/json'))
				) {
					const text = await res.text().catch(() => '');
					if (text.length > 0) {
						try {
							data = JSON.parse(text);
						} catch {
							data = text;
						}
					}
				} else {
					data = await res.text().catch(() => undefined);
				}
			}

			if (!res.ok) {
				throw createNetworkError<B, Extra>(
					res.status,
					`Request failed with status ${res.status}`,
					request,
				);
			}

			return {
				data: data as T,
				status: res.status,
				statusText: res.statusText,
				headers,
				config: request,
				raw: res,
			};
		} catch (err) {
			if (err instanceof NetworkError) throw err;
			const isAbort = err instanceof Error && err.name === 'AbortError';
			throw createNetworkError<B, Extra>(
				isAbort ? 408 : 0,
				isAbort ? 'Request aborted or timed out' : (err as Error).message,
				request,
				err,
			);
		} finally {
			if (timeout) clearTimeout(timeout);
			if (request.signal && onAbort) {
				request.signal.removeEventListener('abort', onAbort);
			}
		}
	}
}
