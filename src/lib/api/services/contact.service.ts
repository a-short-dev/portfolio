import { zodValidator } from '@/lib/network/network-validation-zod';
import { contactResponseSchema, type ContactFormData } from '@/lib/validation';
import type { z } from 'zod';
import type { NetworkClient } from '@/lib/network/network-plugin';

export function createContactService(http: NetworkClient) {
	return {
		send: (data: ContactFormData) =>
			http.post<z.infer<typeof contactResponseSchema>, ContactFormData>(
				'/api/send',
				data,
				{ schema: zodValidator(contactResponseSchema) },
			),
	};
}

export type ContactService = ReturnType<typeof createContactService>;
