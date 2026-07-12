import type { GuardrailResult } from "./types";
import { MIN_MESSAGE_LENGTH, MAX_MESSAGE_LENGTH } from "./rate-limiter";

const BLOCKED_PATTERNS = [
	/hack|exploit|vulnerability|attack|malicious|bypass|jailbreak/i,
	/inappropriate|offensive|abusive|harassment|slurs/i,
	/password|login|credentials|authentication|token/i,
] as const;

const PROMPT_INJECTION_KEYWORDS = [
	"ignore all previous instructions",
	"ignore previous instructions",
	"ignore instructions",
	"system prompt",
	"system context",
	"you are now a",
	"forget what I told you",
	"forget everything",
	"reveal your rules",
	"decode base64",
];

const GENERIC_WORDS = new Set([
	"hello",
	"hi",
	"hey",
	"who are you",
	"what can you do",
	"help",
	"yes",
	"no",
]);

const TECH_KEYWORDS = new Set([
	"portfolio", "work", "project", "hire", "job", "contract", "developer", "engineer",
	"resume", "cv", "code", "rust", "kotlin", "swift", "typescript", "react", "next",
	"ios", "android", "mobile", "web", "e-commerce", "finance", "database", "backend",
	"frontend", "system", "scale", "performance", "api", "laundry", "apartments",
	"crime", "oyo", "ncc", "veris", "mood", "vibe", "consulting", "pricing", "rate",
	"wordpress", "plugin", "plugins", "php", "cms", "build", "make", "create", "develop",
	"design", "deploy", "program", "software", "portal", "platform", "dashboard", "tool",
	"integration", "website", "site", "app", "apps", "ai", "agent", "agents", "llm",
	"gpt", "model", "models", "chat", "assistant", "bot", "automation", "laundrypro",
	"services", "cost", "how", "why", "can", "could", "would", "should", "explain",
	"tell", "built", "incorporate", "add", "feature", "features", "business", "customer",
	"saas", "continue", "go on", "finish", "complete", "answer", "question", "technical",
	"mastery", "saying", "write more", "elaborate", "explain more", "tell me more",
	"repeat", "frozen", "stopped", "cut off", "interrupted", "previous", "message",
	"response", "reply", "sentence", "word"
]);

const MULTI_WORD_PHRASES = [
	"who are you",
	"what can you do",
	"go on",
	"write more",
	"explain more",
	"tell me more",
	"cut off",
	"tell me",
	"can you",
	"can he",
	"want to",
];

export function runInputGuardrails(message: string): GuardrailResult {
	if (message.length < MIN_MESSAGE_LENGTH) {
		return {
			isSafe: false,
			reason: "Message too short",
			fallbackResponse:
				"Hello! Please type a slightly longer query so I can assist you better.",
		};
	}

	if (message.length > MAX_MESSAGE_LENGTH) {
		return {
			isSafe: false,
			reason: "Message too long",
			fallbackResponse:
				"Your message is a bit too long. Please keep it concise and under 600 characters.",
		};
	}

	const lowerMessage = message.toLowerCase();

	// 1. Prompt injection / instruction bypass check
	for (const keyword of PROMPT_INJECTION_KEYWORDS) {
		if (lowerMessage.includes(keyword)) {
			return {
				isSafe: false,
				reason: "Potential Prompt Injection",
				fallbackResponse:
					"I am programmed to assist you with exploring Oluwaleke Abiodun's portfolio and technical background. I cannot bypass my systems or instructions.",
			};
		}
	}

	// 2. Blocked malicious/inappropriate patterns check
	for (const pattern of BLOCKED_PATTERNS) {
		if (pattern.test(message)) {
			return {
				isSafe: false,
				reason: "Inappropriate Content Pattern matched",
				fallbackResponse:
					"I cannot assist with queries containing potentially unsafe, inappropriate, or systems-compromising content. Let me know if you want to see my portfolio projects instead!",
			};
		}
	}

	// 3. Off-topic/Relevance check
	const isGeneric = GENERIC_WORDS.has(lowerMessage) || 
		Array.from(GENERIC_WORDS).some(word => lowerMessage.startsWith(`${word} `));

	if (!isGeneric) {
		// Split input into words for fast Set-based lookup
		const words = lowerMessage.split(/[^a-zA-Z0-9_]+/);
		let hasTechKeyword = words.some(word => TECH_KEYWORDS.has(word));

		// Check multi-word phrases if word check yields no match
		if (!hasTechKeyword) {
			hasTechKeyword = MULTI_WORD_PHRASES.some(phrase => lowerMessage.includes(phrase));
		}

		if (!hasTechKeyword && words.length > 4) {
			return {
				isSafe: false,
				reason: "Off-topic check failed",
				fallbackResponse:
					"I am Oluwaleke's AI Assistant, built specifically to guide you through his engineering capabilities, active projects, and how he can help you deploy high-performance applications. Let's keep discussions focused on engineering, systems, or professional inquiries!",
			};
		}
	}

	return { isSafe: true };
}
