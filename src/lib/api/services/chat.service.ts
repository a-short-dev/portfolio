import type { ChatInput } from '@/lib/validation';
import type { NetworkClient } from '@/lib/network/network-plugin';

export function createChatService(http: NetworkClient) {
	return {
		stream: (message: string, history?: ChatInput['history']) =>
			http.post<ReadableStream<Uint8Array>, ChatInput>(
				'/api/chat',
				{ message, history },
				{ responseType: 'stream' },
			),
	};
}

export type ChatService = ReturnType<typeof createChatService>;
