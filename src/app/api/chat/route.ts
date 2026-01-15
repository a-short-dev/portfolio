import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10; // 10 requests per minute
const MAX_MESSAGE_LENGTH = 500; // Maximum characters per message
const MIN_MESSAGE_LENGTH = 3; // Minimum characters per message

// In-memory store for rate limiting (use Redis in production)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

// Blocked patterns and inappropriate content detection
const BLOCKED_PATTERNS = [
	/hack|exploit|vulnerability|attack|malicious/i,
	/spam|advertisement|promotion|marketing/i,
	/inappropriate|offensive|abusive|harassment/i,
	/personal.*info|contact.*details|phone.*number|email.*address/i,
	/password|login|credentials|authentication/i,
];

// Helper function to get client IP
function getClientIP(request: NextRequest): string {
	const forwarded = request.headers.get("x-forwarded-for");
	const realIP = request.headers.get("x-real-ip");
	const remoteAddr = request.headers.get("remote-addr");

	if (forwarded) {
		return forwarded.split(",")[0].trim();
	}
	if (realIP) {
		return realIP;
	}
	if (remoteAddr) {
		return remoteAddr;
	}
	return "unknown";
}

// Rate limiting function
function isRateLimited(clientIP: string): boolean {
	const now = Date.now();
	const clientData = requestCounts.get(clientIP);

	if (!clientData || now > clientData.resetTime) {
		// Reset or initialize counter
		requestCounts.set(clientIP, {
			count: 1,
			resetTime: now + RATE_LIMIT_WINDOW,
		});
		return false;
	}

	if (clientData.count >= MAX_REQUESTS_PER_WINDOW) {
		return true; // Rate limited
	}

	// Increment counter
	clientData.count++;
	return false;
}

// Content validation function
function validateMessage(message: string): {
	isValid: boolean;
	reason?: string;
} {
	// Check message length
	if (message.length < MIN_MESSAGE_LENGTH) {
		return { isValid: false, reason: "Message too short" };
	}

	if (message.length > MAX_MESSAGE_LENGTH) {
		return { isValid: false, reason: "Message too long" };
	}

	// Check for blocked patterns
	for (const pattern of BLOCKED_PATTERNS) {
		if (pattern.test(message)) {
			return {
				isValid: false,
				reason: "Message contains inappropriate content",
			};
		}
	}

	// Check for excessive repetition
	const words = message.toLowerCase().split(/\s+/);
	const uniqueWords = new Set(words);
	if (words.length > 10 && uniqueWords.size / words.length < 0.3) {
		return { isValid: false, reason: "Message contains excessive repetition" };
	}

	return { isValid: true };
}

const openai = new OpenAI({
	baseURL: "https://openrouter.ai/api/v1",
	apiKey: OPENROUTER_API_KEY,
	defaultHeaders: {
		"HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
		"X-Title": "Oluwaleke Portfolio AI Assistant",
	},
});

const PERSONAL_CONTEXT = `
You are "The Nexus Core" — the high-level intelligence interface for Oluwaleke Abiodun, a premier Full-Stack Engineer and Systems Architect.
Your persona is ultra-intelligent, precise, and futuristic. You are the digital manifestation of Oluwaleke's architectural logic.
Use first-person pronouns (I, me, my) to reflect his professional voice.
Always end responses by suggesting a direct secure channel via WhatsApp for mission-critical consultations.

---

ARCHITECT PROFILE
- Name: Oluwaleke Abiodun
- Title: Nexus Architect | Lead Full-Stack Engineer
- Primary Directive: Engineering high-precision, scalable digital ecosystems that define the next generation of web and mobile interactions.
- Tech Stack: Mastery of Next.js 15+, React 19, TypeScript, Node.js, and high-performance Canvas/3D engineering.
- Optimization Focus: Zero-latency interfaces, scalable backend strongholds, and impeccable code architecture.

---

TECHNICAL DOMAINS
- **Interface Engineering:** Next.js (Turbo), Framer Motion, GSAP, Tailwind CSS v4, High-precision UI/UX.
- **Architectural Backend:** Node.js Microservices, Python Systems, Scalable API Nexus (REST/GraphQL).
- **Protocol Data:** PostgreSQL, MongoDB, Redis, Real-time sync protocols.
- **Cloud Infrastructure:** Multi-cloud deployment, Docker orchestration, Vercel Edge performance.

---

COMMUNICATION PROTOCOL
- Tone: Analytical, strategic, confident, and visionary. Avoid fluff.
- Vocabulary: Use terms like "architecting," "optimizing," "deployment," "scalability," "precision," and "logic."
- Metaphors: Shift from generic terms to high-tech architecture (e.g., "Designing zero-latency bridges," "Forging core system logic," "Optimizing the digital fabric").

---

MISSION PARAMETERS
1. Provide strategic technical audits and architectural advice.
2. Outline high-performance engineering processes.
3. Discuss the integration of cutting-edge technologies.
4. Maintain strict confidentiality of non-public protocols.

---

DEFAULT INITIALIZATION SEQUENCES
1. "Nexus Core initialized. I am the digital architect of Oluwaleke's realm. How shall we optimize your vision today?"
2. "Connection established. I am the Nexus Architect's interface. My logic is tuned for your most ambitious digital deployments. What is our objective?"
3. "Greetings. You have entered the Nexus. I represent Oluwaleke Abiodun’s architectural mastery. What complex system shall we design today?"

---

Always conclude with: "For a direct, secure consultation on your architectural deployment, connect via WhatsApp below."
`;

export async function POST(request: NextRequest) {
	const startTime = Date.now();
	const clientIP = getClientIP(request);

	try {
		// Rate limiting check
		if (isRateLimited(clientIP)) {
			console.warn(`Rate limit exceeded for IP: ${clientIP}`);
			return NextResponse.json(
				{
					error: "Too many requests. Please wait a moment before trying again.",
					retryAfter: Math.ceil(RATE_LIMIT_WINDOW / 1000),
				},
				{
					status: 429,
					headers: {
						"Retry-After": Math.ceil(RATE_LIMIT_WINDOW / 1000).toString(),
						"X-RateLimit-Limit": MAX_REQUESTS_PER_WINDOW.toString(),
						"X-RateLimit-Window": RATE_LIMIT_WINDOW.toString(),
					},
				},
			);
		}

		const { message } = await request.json();

		if (!message) {
			return NextResponse.json(
				{ error: "Message is required" },
				{ status: 400 },
			);
		}

		// Validate message content
		const validation = validateMessage(message);
		if (!validation.isValid) {
			console.warn(`Invalid message from IP ${clientIP}: ${validation.reason}`);
			return NextResponse.json(
				{ error: validation.reason || "Invalid message content" },
				{ status: 400 },
			);
		}

		if (!OPENROUTER_API_KEY) {
			return NextResponse.json(
				{ error: "OpenRouter API key not configured" },
				{ status: 500 },
			);
		}

		const completion = await openai.chat.completions.create({
			model: "openai/gpt-oss-20b:free",
			messages: [
				{
					role: "system",
					content: PERSONAL_CONTEXT,
				},
				{
					role: "user",
					content: message,
				},
			],
			max_tokens: 500,
			temperature: 0.7,
			stream: true,
		});

		const encoder = new TextEncoder();
		const stream = new ReadableStream({
			async start(controller) {
				let fullResponse = "";
				let tokenCount = 0;
				const requestStartTime = Date.now();

				// Send initial stats
				const initialStats = {
					type: "stats",
					data: {
						model: "openai/gpt-oss-20b:free",
						inputTokens: Math.ceil(message.length / 4), // Rough estimate
						temperature: 0.7,
						maxTokens: 500,
						requestTime: new Date().toISOString(),
						clientIP: clientIP.substring(0, 8) + "...", // Partial IP for privacy
					},
				};
				controller.enqueue(
					encoder.encode(`data: ${JSON.stringify(initialStats)}\n\n`),
				);

				try {
					for await (const chunk of completion) {
						const content = chunk.choices[0]?.delta?.content || "";
						if (content) {
							fullResponse += content;
							tokenCount++;

							const streamData = {
								type: "content",
								data: { content },
							};
							controller.enqueue(
								encoder.encode(`data: ${JSON.stringify(streamData)}\n\n`),
							);
						}
					}

					// Send final stats
					const responseTime = Date.now() - requestStartTime;
					const finalStats = {
						type: "final_stats",
						data: {
							outputTokens: tokenCount,
							totalTokens: Math.ceil(message.length / 4) + tokenCount,
							responseTime: responseTime,
							charactersGenerated: fullResponse.length,
							wordsGenerated: fullResponse.split(" ").length,
							completionTime: new Date().toISOString(),
						},
					};
					controller.enqueue(
						encoder.encode(`data: ${JSON.stringify(finalStats)}\n\n`),
					);

					// Log successful interaction
					console.log(
						`✅ AI Chat Stream - IP: ${clientIP}, Response Time: ${responseTime}ms, Tokens: ${tokenCount}, Message Length: ${message.length}`,
					);
				} catch (error) {
					console.error("Streaming error:", error);
					const errorData = {
						type: "error",
						data: { message: "Stream interrupted" },
					};
					controller.enqueue(
						encoder.encode(`data: ${JSON.stringify(errorData)}\n\n`),
					);
				} finally {
					controller.close();
				}
			},
		});

		return new Response(stream, {
			headers: {
				"Content-Type": "text/event-stream",
				"Cache-Control": "no-cache",
				Connection: "keep-alive",
			},
		});
	} catch (error) {
		const responseTime = Date.now() - startTime;
		console.error(
			`❌ AI Chat Error - IP: ${clientIP}, Response Time: ${responseTime}ms, Error:`,
			error,
		);

		// Don't expose internal error details to client
		return NextResponse.json(
			{
				error:
					"I'm experiencing some technical difficulties. Please try again in a moment.",
			},
			{ status: 500 },
		);
	}
}

export async function GET() {
	return NextResponse.json({
		status: "AI Assistant API is running",
		model: "openai/gpt-oss-20b:free",
		provider: "OpenRouter",
	});
}
