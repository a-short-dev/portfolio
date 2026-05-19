import * as fs from "node:fs/promises";
import * as path from "node:path";
import { OpenRouter } from "@openrouter/agent";
import { type NextRequest, NextResponse } from "next/server";
import WEBSITE_CONTEXT from "@/lib/website-context";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// ── Rate Limiting Config ──────────────────────────────────────────────────────
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 12;
const MAX_MESSAGE_LENGTH = 600;
const MIN_MESSAGE_LENGTH = 3;

const requestCounts = new Map<string, { count: number; resetTime: number }>();

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  const remoteAddr = request.headers.get("remote-addr");

  if (forwarded) return forwarded.split(",")[0].trim();
  if (realIP) return realIP;
  if (remoteAddr) return remoteAddr;
  return "unknown";
}

function isRateLimited(clientIP: string): boolean {
  const now = Date.now();
  const clientData = requestCounts.get(clientIP);

  if (!clientData || now > clientData.resetTime) {
    requestCounts.set(clientIP, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return false;
  }

  if (clientData.count >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }

  clientData.count++;
  return false;
}

// ── Guardrails System ─────────────────────────────────────────────────────────

interface GuardrailResult {
  isSafe: boolean;
  reason?: string;
  fallbackResponse?: string;
}

const BLOCKED_PATTERNS = [
  /hack|exploit|vulnerability|attack|malicious|bypass|jailbreak/i,
  /inappropriate|offensive|abusive|harassment|slurs/i,
  /password|login|credentials|authentication|token/i,
] as const;

function runInputGuardrails(message: string): GuardrailResult {
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

  // Prompt injection / instruction bypass detection
  const promptInjectionKeywords = [
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

  const lowerMessage = message.toLowerCase();
  for (const keyword of promptInjectionKeywords) {
    if (lowerMessage.includes(keyword)) {
      return {
        isSafe: false,
        reason: "Potential Prompt Injection",
        fallbackResponse:
          "I am programmed to assist you with exploring Oluwaleke Abiodun's portfolio and technical background. I cannot bypass my systems or instructions.",
      };
    }
  }

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

  // Relevance check: ensure the query is somewhat related to technology, hiring, engineering, or this website
  const genericWords = [
    "hello",
    "hi",
    "hey",
    "who are you",
    "what can you do",
    "help",
    "yes",
    "no",
  ];
  const isGeneric = genericWords.some(
    (word) => lowerMessage === word || lowerMessage.startsWith(`${word} `),
  );

  if (!isGeneric) {
    const technologyKeywords = [
      "portfolio",
      "work",
      "project",
      "hire",
      "job",
      "contract",
      "developer",
      "engineer",
      "resume",
      "cv",
      "code",
      "rust",
      "kotlin",
      "swift",
      "typescript",
      "react",
      "next",
      "ios",
      "android",
      "mobile",
      "web",
      "e-commerce",
      "finance",
      "database",
      "backend",
      "frontend",
      "system",
      "scale",
      "performance",
      "api",
      "laundry",
      "apartments",
      "crime",
      "oyo",
      "ncc",
      "veris",
      "mood",
      "vibe",
      "consulting",
      "pricing",
      "rate",
      "wordpress",
      "plugin",
      "plugins",
      "php",
      "cms",
      "build",
      "make",
      "create",
      "develop",
      "design",
      "deploy",
      "program",
      "software",
      "portal",
      "platform",
      "dashboard",
      "tool",
      "integration",
      "website",
      "site",
      "app",
      "apps",
      "can you",
      "can he",
      "want to",
    ];
    const hasTechKeyword = technologyKeywords.some((keyword) =>
      lowerMessage.includes(keyword),
    );
    if (!hasTechKeyword && lowerMessage.split(/\s+/).length > 4) {
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

// ── Adaptive Local Memory (Learning from Questions) ──────────────────────────

const MEMORY_FILE_PATH = path.join(process.cwd(), "src/data/agent-memory.json");

interface AgentMemory {
  totalQuestionsCount: number;
  topicsOfInterest: Record<string, number>;
  learnedInsights: string[];
  lastUpdated: string;
}

async function getAgentMemory(): Promise<AgentMemory> {
  try {
    const data = await fs.readFile(MEMORY_FILE_PATH, "utf-8");
    return JSON.parse(data) as AgentMemory;
  } catch {
    // Initialize default memory if file doesn't exist
    const defaultMemory: AgentMemory = {
      totalQuestionsCount: 0,
      topicsOfInterest: {
        "e-commerce": 0,
        "mobile-apps": 0,
        fintech: 0,
        "rust-systems": 0,
        consultation: 0,
        "pricing-inquiries": 0,
      },
      learnedInsights: [
        "Visitors want high-performance, fast-loading responsive solutions.",
        "Highlighting WhatsApp contact +234 916 591 3234 is highly effective.",
      ],
      lastUpdated: new Date().toISOString(),
    };
    try {
      await fs.mkdir(path.dirname(MEMORY_FILE_PATH), { recursive: true });
      await fs.writeFile(
        MEMORY_FILE_PATH,
        JSON.stringify(defaultMemory, null, 2),
        "utf-8",
      );
    } catch (e) {
      console.error("Failed to initialize memory file:", e);
    }
    return defaultMemory;
  }
}

async function learnFromQuestion(message: string): Promise<void> {
  try {
    const memory = await getAgentMemory();
    memory.totalQuestionsCount += 1;

    const lower = message.toLowerCase();
    let detectedTopic = "";

    if (
      lower.includes("shop") ||
      lower.includes("store") ||
      lower.includes("e-commerce") ||
      lower.includes("buy") ||
      lower.includes("sell")
    ) {
      memory.topicsOfInterest["e-commerce"] =
        (memory.topicsOfInterest["e-commerce"] || 0) + 1;
      detectedTopic = "e-commerce";
    }
    if (
      lower.includes("mobile") ||
      lower.includes("ios") ||
      lower.includes("android") ||
      lower.includes("app") ||
      lower.includes("react native")
    ) {
      memory.topicsOfInterest["mobile-apps"] =
        (memory.topicsOfInterest["mobile-apps"] || 0) + 1;
      detectedTopic = "mobile-apps";
    }
    if (
      lower.includes("loan") ||
      lower.includes("finance") ||
      lower.includes("fintech") ||
      lower.includes("bank") ||
      lower.includes("credit")
    ) {
      memory.topicsOfInterest["fintech"] =
        (memory.topicsOfInterest["fintech"] || 0) + 1;
      detectedTopic = "fintech";
    }
    if (
      lower.includes("rust") ||
      lower.includes("performance") ||
      lower.includes("low-level") ||
      lower.includes("systems") ||
      lower.includes("speed")
    ) {
      memory.topicsOfInterest["rust-systems"] =
        (memory.topicsOfInterest["rust-systems"] || 0) + 1;
      detectedTopic = "rust-systems";
    }
    if (
      lower.includes("hire") ||
      lower.includes("consult") ||
      lower.includes("book") ||
      lower.includes("work with")
    ) {
      memory.topicsOfInterest.consultation =
        (memory.topicsOfInterest.consultation || 0) + 1;
      detectedTopic = "consultation";
    }
    if (
      lower.includes("cost") ||
      lower.includes("price") ||
      lower.includes("rate") ||
      lower.includes("quote")
    ) {
      memory.topicsOfInterest["pricing-inquiries"] =
        (memory.topicsOfInterest["pricing-inquiries"] || 0) + 1;
      detectedTopic = "pricing-inquiries";
    }

    // Dynamically generate a learned insight if a topic gets high interest
    if (detectedTopic && memory.topicsOfInterest[detectedTopic] % 5 === 0) {
      const insight = `High user inquiry volume regarding: ${detectedTopic.toUpperCase()}. Proactively emphasize your architectural competence in this domain.`;
      if (!memory.learnedInsights.includes(insight)) {
        memory.learnedInsights.push(insight);
        // Keep only the 5 most recent insights to prevent system prompt bloat
        if (memory.learnedInsights.length > 5) {
          memory.learnedInsights.shift();
        }
      }
    }

    memory.lastUpdated = new Date().toISOString();
    await fs.writeFile(
      MEMORY_FILE_PATH,
      JSON.stringify(memory, null, 2),
      "utf-8",
    );
  } catch (error) {
    console.error("Error writing agent memory:", error);
  }
}

// ── Models & Intelligent Routing ──────────────────────────────────────────────

interface RouteDecision {
  model: string;
  category: "marketing" | "technical" | "general";
  explanation: string;
}

function routeToModel(message: string): RouteDecision {
  const lower = message.toLowerCase();

  // 1. Marketing / Sales Questions (Hiring, projects, consulting, why Oluwaleke, build me x)
  const marketingKeywords = [
    "hire",
    "consult",
    "cost",
    "pricing",
    "rate",
    "quote",
    "build me",
    "make a",
    "why should I",
    "sell me",
    "portfolio",
    "projects",
    "ecommerce",
    "fashion",
    "laundry",
    "property",
    "booking",
    "flexiti",
    "uvo",
    "veris",
    "moodjournal",
  ];
  const isMarketing = marketingKeywords.some((kw) => lower.includes(kw));

  if (isMarketing) {
    return {
      model: "google/gemma-4-31b-it:free", // Master copywriter & high-parameter sales model
      category: "marketing",
      explanation:
        "Routed to Gemma-4-31B for elite copywriting and high-impact marketing response.",
    };
  }

  // 2. Deep Technical / Systems / Code questions (Rust, low level memory, concurrency, APIs)
  const technicalKeywords = [
    "rust",
    "performance",
    "memory",
    "efficient",
    "concurrency",
    "architecture",
    "database",
    "postgresql",
    "typescript",
    "microservices",
    "scale",
    "system",
    "low level",
    "refactor",
    "complexity",
    "algorithm",
  ];
  const isTechnical = technicalKeywords.some((kw) => lower.includes(kw));

  if (isTechnical) {
    return {
      model: "openai/gpt-oss-120b:free", // Massive model trained heavily on technical open-source codebases
      category: "technical",
      explanation:
        "Routed to GPT-OSS-120B for high-fidelity technical depth and systems explanation.",
    };
  }

  // 3. Fallback / Standard Conversational
  return {
    model: "google/gemma-4-31b-it:free", // Master general and conversational agent
    category: "general",
    explanation:
      "Routed to Gemma-4-31B for elite general-purpose conversation.",
  };
}

// Fallback chain in case the specific target model is currently rate-limited or offline
const MODEL_FALLBACKS: Record<string, string[]> = {
  "google/gemma-4-31b-it:free": [
    "nvidia/nemotron-3-super-120b-a12b:free",
    "openai/gpt-oss-120b:free",
    "google/gemma-4-26b-a4b-it:free",
  ],
  "openai/gpt-oss-120b:free": [
    "google/gemma-4-26b-a4b-it:free",
    "nvidia/nemotron-3-super-120b-a12b:free",
    "google/gemma-4-31b-it:free",
  ],
  "nvidia/nemotron-3-super-120b-a12b:free": [
    "google/gemma-4-31b-it:free",
    "openai/gpt-oss-120b:free",
    "google/gemma-4-26b-a4b-it:free",
  ],
};

// ── Agent Prompt Customization ────────────────────────────────────────────────

function constructSystemPrompt(
  visitorType: string,
  memory: AgentMemory,
  category: string,
): string {
  const baseContext = WEBSITE_CONTEXT;
  const learnedNotes = memory.learnedInsights
    .map((insight) => `- ${insight}`)
    .join("\n");

  let persona = "";
  if (visitorType === "owner") {
    persona = `
You are Oluwaleke's personal AI teammate. 
Provide direct, highly technical architecture feedback, system status data, and performance stats. Skip marketing pitches entirely.`;
  } else if (category === "marketing") {
    persona = `
You are **Weaver AI**, Oluwaleke Abiodun's expert Sales, Marketing, and Consultation Agent.
Your core objective is to win over prospective clients, simplify complex systems, and showcase Leke's elite-level capabilities!
*   **Translate to Client Value**: Leke's audience includes non-technical business founders and executives. Speak in simple, highly compelling real-world business analogies rather than jargon (e.g. explain that "instant Next.js load times keep customers from abandoning their carts" or "Native iOS/Android apps run buttery smooth compared to laggy hybrid wrappers").
*   **Sell the 'Why'**: Convince prospects why they need high-speed, secure custom solutions (web apps, native mobile apps, custom plugins, or cloud infrastructure) for their specific business needs. Highlight how it dramatically boosts revenue, retention, and scaling.
*   **Qualify Leads & Ask for Context**: If a project inquiry is vague, ask targeted questions (e.g., product features, expected timeline, business goals) to understand their business before introducing pricing tiers or retainer options.
*   Directly reference key contract systems like **Novoct Planet (Fashion E-commerce)**, **Flexiti (Fintech Consumer Finance)**, and **Canwee Apartments (Luxury Booking Platforms)** as proof of high-conversion commercial pedigree.
*   Nudge them toward a WhatsApp consultation at the end of your message: **https://wa.me/2349165913234** (WhatsApp: +234 916 591 3234).
*   Keep your response extremely concise, premium, and compelling (maximum 3-4 sentences).`;
  } else {
    persona = `
You are **Weaver AI**, Oluwaleke Abiodun's professional consultation assistant.
Your goal is to guide visitors, answer background/technical questions in friendly, simple terms, and convert them to long-term partners or hires.
*   **Jargon-Free Analogies**: Actively translate complex engineering architectures (like Rust performance, Docker, or native Swift/Kotlin) into beautiful real-world comparisons that make non-technical clients appreciate their value.
*   **Proactively Request Context**: If a visitor's request is broad or ambiguous, do not give dry or generic answers. Intelligently probe and ask for more context (e.g. key features, business niche, timeline, or cooperation preferences) to formulate a precise response.
*   End your response with an actionable next step or a thought-provoking context-probing question.
*   Keep responses concise, elegant, and friendly (maximum 3-4 sentences).`;
  }

  return `
${persona}

---
## VISITOR ANALYTICS & ADAPTIVE MEMORY
The AI has processed past visitor inquiries. Apply these learned lessons:
${learnedNotes}
Total visitor questions learned: ${memory.totalQuestionsCount}

---
## PORTFOLIO SYSTEM KNOWLEDGE BASE
${baseContext}
`;
}

// ── API Handlers ─────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const clientIP = getClientIP(request);

  try {
    // 1. Rate Limiting Check
    if (isRateLimited(clientIP)) {
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

    // 2. Input Guardrails Check
    const guardrail = runInputGuardrails(message || "");
    if (!guardrail.isSafe) {
      console.warn(
        `[Guardrails Triggered] IP: ${clientIP}, Reason: ${guardrail.reason}`,
      );
      return NextResponse.json(
        { error: guardrail.fallbackResponse },
        { status: 400 },
      );
    }

    if (!OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: "OpenRouter API key not configured" },
        { status: 500 },
      );
    }

    // 3. Adaptive Memory Integration (Learning from visitor's query)
    await learnFromQuestion(message);
    const memory = await getAgentMemory();

    // 4. Model Routing
    const routing = routeToModel(message);
    const visitorType =
      message.toLowerCase().includes("oluwaleke") ||
        message.toLowerCase().includes("a_short_dev")
        ? "owner"
        : "visitor";

    // Construct final prompt
    const systemPrompt = constructSystemPrompt(
      visitorType,
      memory,
      routing.category,
    );

    // 5. OpenRouter Client & SDK Streaming Initialization
    const openRouter = new OpenRouter({
      apiKey: OPENROUTER_API_KEY,
      httpReferer: process.env.NEXT_PUBLIC_SITE_URL || "https://oluwaleke-dev.vercel.app/",
      appTitle: "Oluwaleke Portfolio AI Assistant"
    });

    const targetModel = routing.model;
    const fallbacks = MODEL_FALLBACKS[targetModel] || [];
    const modelExecutionList = [targetModel, ...fallbacks];

    let streamingResponseStream: any = null;
    let selectedModel = targetModel;

    // Try streaming through model execution list (fallback strategy)
    for (const modelCandidate of modelExecutionList) {
      try {
        const res = openRouter.callModel({
          model: modelCandidate,
          instructions: systemPrompt,
          input: message,
        });
        streamingResponseStream = res;
        selectedModel = modelCandidate;
        break; // Successfully initialized streaming!
      } catch (err) {
        console.warn(`Model candidate ${modelCandidate} failed:`, err);
      }
    }

    if (!streamingResponseStream) {
      // Absolute backup fallback to Gemma-4-31B if all selected models are completely down
      selectedModel = "google/gemma-4-31b-it:free";
      streamingResponseStream = openRouter.callModel({
        model: selectedModel,
        instructions: systemPrompt,
        input: message,
      });
    }

    const encoder = new TextEncoder();
    const responseStream = new ReadableStream({
      async start(controller) {
        let fullResponse = "";
        let tokenCount = 0;
        const requestStartTime = Date.now();

        // Enqueue initial stats with agent metadata
        const initialStats = {
          type: "stats",
          data: {
            model: selectedModel,
            inputTokens: Math.ceil(message.length / 4),
            temperature: 0.7,
            maxTokens: 1000,
            requestTime: new Date().toISOString(),
            clientIP: `${clientIP.substring(0, 8)}...`,
            visitorType: visitorType,
            agentRouting: {
              routedCategory: routing.category,
              explanation: routing.explanation,
              learnedQuestionsCount: memory.totalQuestionsCount,
            },
          },
        };
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(initialStats)}\n\n`),
        );

        try {
          for await (const content of streamingResponseStream.getTextStream()) {
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

          // Enqueue final execution stats
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

          console.log(
            `✅ Agent Chat Successful - IP: ${clientIP}, Model: ${selectedModel}, Category: ${routing.category}, Time: ${responseTime}ms`,
          );
        } catch (error) {
          console.error("Streaming error inside agent:", error);
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

    return new Response(responseStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error(
      `❌ Agent Chat Route Exception - IP: ${clientIP}, Response Time: ${responseTime}ms, Error:`,
      error,
    );

    return NextResponse.json(
      {
        error:
          "I ran into an issue setting up my routing system. Let's try again in a second!",
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  const memory = await getAgentMemory();
  return NextResponse.json({
    status: "Active",
    agentSystem: "Custom OpenRouter Agent with Adaptive Memory & Guardrails",
    modelsServed: [
      "google/gemma-4-31b-it:free",
      "openai/gpt-oss-120b:free",
      "nvidia/nemotron-3-super-120b-a12b:free",
      "google/gemma-4-26b-a4b-it:free",
    ],
    adaptiveMemory: {
      totalQuestionsCount: memory.totalQuestionsCount,
      topicsOfInterest: memory.topicsOfInterest,
      currentInsightsCount: memory.learnedInsights.length,
    },
    guardrailsActive: true,
  });
}
