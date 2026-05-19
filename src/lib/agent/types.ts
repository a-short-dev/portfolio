export interface GuardrailResult {
  isSafe: boolean;
  reason?: string;
  fallbackResponse?: string;
}

export interface AgentMemory {
  totalQuestionsCount: number;
  topicsOfInterest: Record<string, number>;
  learnedInsights: string[];
  lastUpdated: string;
}

export type RoutingCategory = "marketing" | "technical" | "general";

export interface RouteDecision {
  model: string;
  category: RoutingCategory;
  explanation: string;
}

export interface InitialStatsPayload {
  type: "stats";
  data: {
    model: string;
    inputTokens: number;
    temperature: number;
    maxTokens: number;
    requestTime: string;
    clientIP: string;
    visitorType: "owner" | "visitor";
    agentRouting: {
      routedCategory: RoutingCategory;
      explanation: string;
      learnedQuestionsCount: number;
    };
  };
}

export interface ContentPayload {
  type: "content";
  data: {
    content: string;
  };
}

export interface FinalStatsPayload {
  type: "final_stats";
  data: {
    outputTokens: number;
    totalTokens: number;
    responseTime: number;
    charactersGenerated: number;
    wordsGenerated: number;
    completionTime: string;
  };
}

export interface ErrorPayload {
  type: "error";
  data: {
    message: string;
  };
}

export type SSEPayload =
  | InitialStatsPayload
  | ContentPayload
  | FinalStatsPayload
  | ErrorPayload;
