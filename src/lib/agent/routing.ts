import type { RouteDecision } from "./types";

export const MODEL_FALLBACKS: Record<string, string[]> = {
  "z-ai/glm-4.5-air:free": [
    "openai/gpt-oss-120b:free",
    "nvidia/nemotron-3-super-120b-a12b:free",
  ],
  "openai/gpt-oss-120b:free": [
    "z-ai/glm-4.5-air:free",
    "nvidia/nemotron-3-super-120b-a12b:free",
  ],
  "openrouter/owl-alpha": [
    "nvidia/nemotron-nano-12b-v2-vl:free",
    "openai/gpt-oss-120b:free",
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
      model: "z-ai/glm-4.5-air:free", // Elite-parameter copywriter/marketing model (Working)
      category: "marketing",
      explanation:
        "Routed to GLM-4.5 Air for high-parameter copywriting and marketing response.",
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
      model: "openai/gpt-oss-120b:free", // Next-gen programming-centric model (Working)
      category: "technical",
      explanation:
        "Routed to GPT-OSS 120B for advanced technical architecture and code assistance.",
    };
  }

  // 3. Fallback / Standard Conversational
  return {
    model: "openrouter/owl-alpha", // Elite conversational & general reasoning agent (Working)
    category: "general",
    explanation:
      "Routed to OpenRouter Owl Alpha for optimal general-purpose conversation.",
  };
}
