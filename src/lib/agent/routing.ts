import type { RouteDecision } from "./types";

export const MODEL_FALLBACKS: Record<string, string[]> = {
  "google/gemma-4-31b-it:free": [
    "google/gemma-4-26b-a4b-it:free",
    "openai/gpt-oss-120b:free",
    "z-ai/glm-4.5-air:free",
    "nvidia/nemotron-3-super-120b-a12b:free",
  ],
  "qwen/qwen3-coder:free": [
    "z-ai/glm-4.5-air:free",
    "openai/gpt-oss-120b:free",
    "google/gemma-4-31b-it:free",
    "nvidia/nemotron-3-super-120b-a12b:free",
  ],
  "openrouter/owl-alpha": [
    "deepseek/deepseek-v4-flash:free",
    "nvidia/nemotron-nano-12b-v2-vl:free",
    "google/gemma-4-31b-it:free",
  ],
};

export function routeToModel(message: string): RouteDecision {
  const lower = message.toLowerCase();

  // 1. Marketing / Sales Questions (Hiring, projects, consulting, why Oluwaleke, build me x, pricing)
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
      model: "google/gemma-4-31b-it:free", // Elite-parameter copywriter/marketing model
      category: "marketing",
      explanation:
        "Routed to Gemma-4-31B for high-parameter copywriting and marketing response.",
    };
  }

  // 2. Technical / Systems / Code / Architecture (Rust, low level memory, concurrency, APIs)
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
    "code",
    "coding",
    "ios",
    "android",
    "mobile",
    "app",
    "apps",
    "react",
    "native",
    "swift",
    "kotlin",
    "next",
    "backend",
    "frontend",
    "api",
  ];
  const isTechnical = technicalKeywords.some((kw) => lower.includes(kw));

  if (isTechnical) {
    return {
      model: "qwen/qwen3-coder:free", // Next-gen programming-centric model
      category: "technical",
      explanation:
        "Routed to Qwen-3 Coder for advanced technical architecture and code assistance.",
    };
  }

  // 3. Fallback / Standard Conversational
  return {
    model: "openrouter/owl-alpha", // Elite conversational & general reasoning agent
    category: "general",
    explanation:
      "Routed to OpenRouter Owl Alpha for optimal general-purpose conversation.",
  };
}
