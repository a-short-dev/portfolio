import { NetworkError } from './network-error';
import type { NetworkRequest } from './types';

export interface ResponseValidator<T> {
	parse(data: unknown): T;
}

export function validateResponse<T>(
	validator: ResponseValidator<T>,
	data: unknown,
	request: NetworkRequest<unknown, object>,
): T {
	try {
		return validator.parse(data);
	} catch (error) {
		throw new NetworkError('Response validation failed', request, {
			cause: error,
		});
	}
}
