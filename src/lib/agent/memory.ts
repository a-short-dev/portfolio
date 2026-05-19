import * as fs from "node:fs/promises";
import * as path from "node:path";
import type { AgentMemory } from "./types";

const MEMORY_FILE_PATH = path.join(process.cwd(), "src/data/agent-memory.json");

export async function getAgentMemory(): Promise<AgentMemory> {
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

export async function learnFromQuestion(message: string): Promise<void> {
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
