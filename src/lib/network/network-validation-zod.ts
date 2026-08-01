// Peer dependency: this file imports 'zod'. If you never import
// network-validators-zod.ts, zod is never required by the rest of the library.
import type { ZodType } from 'zod';
import type { ResponseValidator } from './network-validation';

export function zodValidator<T>(schema: ZodType<T>): ResponseValidator<T> {
	return {
		parse: (data: unknown) => schema.parse(data),
	};
}

/**
 * Non-throwing variant, useful when you want to inspect issues yourself
 * rather than catch a ValidationError.
 */
export function zodSafeValidator<T>(schema: ZodType<T>): ResponseValidator<T> {
	return {
		parse: (data: unknown) => {
			const result = schema.safeParse(data);
			if (!result.success) throw result.error;
			return result.data;
		},
	};
}
