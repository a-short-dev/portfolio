export interface Message {
	id: string;
	content: string;
	isUser: boolean;
	timestamp: Date;
	hasWhatsAppOption?: boolean;
	stats?: {
		model?: string;
		inputTokens?: number;
		outputTokens?: number;
		totalTokens?: number;
		responseTime?: number;
		charactersGenerated?: number;
		wordsGenerated?: number;
		temperature?: number;
		maxTokens?: number;
		requestTime?: string;
		completionTime?: string;
		clientIP?: string;
	};
	isStreaming?: boolean;
}
