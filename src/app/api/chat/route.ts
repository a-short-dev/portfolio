import { OpenRouter } from "@openrouter/agent";
import { type NextRequest, NextResponse } from "next/server";
import { runInputGuardrails } from "@/lib/agent/guardrails";
import { getAgentMemory, learnFromQuestion } from "@/lib/agent/memory";
import { constructSystemPrompt } from "@/lib/agent/prompt";
import { getClientIP, isRateLimited } from "@/lib/agent/rate-limiter";
import { MODEL_FALLBACKS, routeToModel } from "@/lib/agent/routing";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const clientIP = getClientIP(request);

  try {
    // 1. Rate Limiting Check
    if (isRateLimited(clientIP)) {
      return NextResponse.json(
        {
          error: "Too many requests. Please wait a moment before trying again.",
          retryAfter: 60,
        },
        {
          status: 429,
          headers: {
            "Retry-After": "60",
            "X-RateLimit-Limit": "12",
            "X-RateLimit-Window": "60000",
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

    // 4. Model Routing & Cookie-based Visitor Identification
    const routing = routeToModel(message);
    const returningCookie = request.cookies.get("returning_visitor");
    const isReturning = !!returningCookie;
    const isOwner =
      message.toLowerCase().includes("oluwaleke") ||
      message.toLowerCase().includes("a_short_dev");

    const visitorType = isOwner ? "owner" : isReturning ? "returning" : "new";

    // Construct final prompt
    const systemPrompt = constructSystemPrompt(
      visitorType,
      memory,
      routing.category,
    );

    // 5. OpenRouter Client & SDK Streaming Initialization
    const openRouter = new OpenRouter({
      apiKey: OPENROUTER_API_KEY,
      httpReferer:
        process.env.NEXT_PUBLIC_SITE_URL || "https://oluwaleke-dev.vercel.app/",
      appTitle: "Oluwaleke Portfolio AI Assistant",
    });

    const targetModel = routing.model;
    const fallbacks = MODEL_FALLBACKS[targetModel] || [];
    const modelExecutionList = [targetModel, ...fallbacks];

    let selectedModel = targetModel;

    const encoder = new TextEncoder();
    const responseStream = new ReadableStream({
      async start(controller) {
        let success = false;
        let fullResponse = "";
        let tokenCount = 0;
        const requestStartTime = Date.now();

        for (const modelCandidate of modelExecutionList) {
          try {
            console.log(
              `[Agent Router] Attempting stream with model: ${modelCandidate}`,
            );
            const res = openRouter.callModel({
              model: modelCandidate,
              instructions: systemPrompt,
              input: message,
            });

            for await (const content of res.getTextStream()) {
              if (!success) {
                success = true;
                selectedModel = modelCandidate;
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
              }

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

            if (success) {
              break; // Stream completed successfully with this model candidate
            }
          } catch (err) {
            console.warn(
              `[Agent Router Warning] Model candidate ${modelCandidate} failed to stream:`,
              err,
            );
          }
        }

        if (!success) {
          console.error(
            "❌ [Agent Router Critical] All model candidates and fallbacks failed to stream.",
          );
          const errorData = {
            type: "error",
            data: { message: "Stream interrupted" },
          };
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(errorData)}\n\n`),
          );
          controller.close();
          return;
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
        controller.close();
      },
    });

    const responseHeaders = new Headers({
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });

    if (!isReturning && !isOwner) {
      responseHeaders.append(
        "Set-Cookie",
        "returning_visitor=true; Path=/; Max-Age=31536000; SameSite=Lax",
      );
    }

    return new Response(responseStream, {
      headers: responseHeaders,
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
      "openrouter/owl-alpha",
      "nvidia/nemotron-3-super-120b-a12b:free",
      "nvidia/llama-nemotron-embed-vl-1b-v2:free",
      "nvidia/nemotron-nano-12b-v2-vl:free",
      "deepseek/deepseek-v4-flash:free",
      "openai/gpt-oss-120b:free",
      "qwen/qwen3-coder:free",
      "z-ai/glm-4.5-air:free",
      "google/gemma-4-26b-a4b-it:free",
      "google/gemma-4-31b-it:free",
    ],
    adaptiveMemory: {
      totalQuestionsCount: memory.totalQuestionsCount,
      topicsOfInterest: memory.topicsOfInterest,
      currentInsightsCount: memory.learnedInsights.length,
    },
    guardrailsActive: true,
  });
}
