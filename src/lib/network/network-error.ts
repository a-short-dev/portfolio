import type { NetworkRequest } from './types';

export class NetworkError<
	B = unknown,
	Extra extends object = {},
> extends Error {
	readonly status?: number;
	readonly config: NetworkRequest<B, Extra, string>;
	readonly cause?: unknown;

	constructor(
		message: string,
		config: NetworkRequest<B, Extra, string>,
		opts?: { status?: number; cause?: unknown },
	) {
		super(message);
		this.name = 'NetworkError';
		this.status = opts?.status;
		this.config = config;
		this.cause = opts?.cause;
	}
}

export class UnauthorizedError<B = unknown, Extra extends object = {}> extends NetworkError<B, Extra> {
	constructor(message: string, config: NetworkRequest<B, Extra, string>, opts?: { cause?: unknown }) {
		super(message, config, { status: 401, cause: opts?.cause });
		this.name = 'UnauthorizedError';
	}
}

export class ForbiddenError<B = unknown, Extra extends object = {}> extends NetworkError<B, Extra> {
	constructor(message: string, config: NetworkRequest<B, Extra, string>, opts?: { cause?: unknown }) {
		super(message, config, { status: 403, cause: opts?.cause });
		this.name = 'ForbiddenError';
	}
}

export class NotFoundError<B = unknown, Extra extends object = {}> extends NetworkError<B, Extra> {
	constructor(message: string, config: NetworkRequest<B, Extra, string>, opts?: { cause?: unknown }) {
		super(message, config, { status: 404, cause: opts?.cause });
		this.name = 'NotFoundError';
	}
}

export class RateLimitError<B = unknown, Extra extends object = {}> extends NetworkError<B, Extra> {
	constructor(message: string, config: NetworkRequest<B, Extra, string>, opts?: { cause?: unknown }) {
		super(message, config, { status: 429, cause: opts?.cause });
		this.name = 'RateLimitError';
	}
}

export class InternalServerError<B = unknown, Extra extends object = {}> extends NetworkError<B, Extra> {
	constructor(message: string, config: NetworkRequest<B, Extra, string>, opts?: { status?: number; cause?: unknown }) {
		super(message, config, { status: opts?.status ?? 500, cause: opts?.cause });
		this.name = 'InternalServerError';
	}
}
