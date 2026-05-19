import { OpenRouter } from "@openrouter/agent";
import { type NextRequest, NextResponse } from "next/server";
import { runInputGuardrails } from "@/lib/agent/guardrails";
import { getAgentMemory, learnFromQuestion } from "@/lib/agent/memory";
import { constructSystemPrompt } from "@/lib/agent/prompt";
import { getClientIP, isRateLimited } from "@/lib/agent/rate-limiter";
import { MODEL_FALLBACKS, routeToModel } from "@/lib/agent/routing";

export const maxDuration = 60; // Extend Vercel runtime function timeout to maximum allowed 60 seconds

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

    const { message, history } = await request.json();
    const ownerSecret = process.env.OWNER_SECRET_KEY || "leke_admin_session_key_2026";
    const lowerMessage = (message || "").toLowerCase().trim();

    // Check if request is sent by the verified owner
    const ownerCookie = request.cookies.get("owner_session")?.value;
    const isOwner = ownerCookie === ownerSecret;

    // Sudo Administrative Command Interceptor (Bypasses LLM/Guardrails completely for security)
    const isAuthCommand = lowerMessage.startsWith("/sudo auth ") || lowerMessage.startsWith("/auth ");
    const isLogoutCommand = lowerMessage === "/sudo logout" || lowerMessage === "/logout";

    if (isAuthCommand || isLogoutCommand) {
      const encoder = new TextEncoder();
      const responseStream = new ReadableStream({
        async start(controller) {
          if (isAuthCommand) {
            const parts = message.trim().split(/\s+/);
            const providedKey = parts[2] || parts[1]; // Handle '/sudo auth key' or '/auth key'
            const authSuccess = providedKey === ownerSecret;

            if (authSuccess) {
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({
                    type: "content",
                    data: {
                      content: "🔓 **[System Security] Owner authentication successful.** System administrative clearance granted. Admin cookie initialized.",
                    },
                  })}\n\n`
                )
              );
            } else {
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({
                    type: "content",
                    data: {
                      content: "🔒 **[System Security] Access denied.** Invalid administrative key protocol.",
                    },
                  })}\n\n`
                )
              );
            }
          } else {
            // Logout command
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  type: "content",
                  data: {
                    content: "🔒 **[System Security] Administrative session terminated.** Admin credentials cleared successfully.",
                  },
                })}\n\n`
              )
            );
          }
          controller.close();
        },
      });

      const response = new NextResponse(responseStream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        },
      });

      if (isAuthCommand) {
        const parts = message.trim().split(/\s+/);
        const providedKey = parts[2] || parts[1];
        if (providedKey === ownerSecret) {
          response.cookies.set("owner_session", ownerSecret, {
            maxAge: 60 * 60 * 24 * 30, // 30 days
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
          });
        } else {
          response.cookies.delete("owner_session");
        }
      } else {
        response.cookies.delete("owner_session");
      }
      return response;
    }

    // 2. Input Guardrails Check (Bypassed entirely for the verified owner!)
    if (!isOwner) {
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
    }

    if (!OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: "OpenRouter API key not configured" },
        { status: 500 },
      );
    }

    // 3. Adaptive Memory Integration (Only learn from standard visitors, not the owner!)
    if (!isOwner) {
      await learnFromQuestion(message);
    }
    const memory = await getAgentMemory();

    // 4. Model Routing & Cookie-based Visitor Identification
    const routing = routeToModel(message);
    const returningCookie = request.cookies.get("returning_visitor");
    const isReturning = !!returningCookie;

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

        // Safe enqueue helper to avoid "Controller is already closed" uncaught exceptions
        const safeEnqueue = (data: Uint8Array) => {
          try {
            if (controller.desiredSize !== null) {
              controller.enqueue(data);
            }
          } catch (e) {
            console.warn("[Agent Router] Stream closed during enqueue:", e);
          }
        };

        // Mask internal model endpoints for standard visitors to protect proprietary IP
        const getMaskedModel = (rawModel: string): string => {
          if (isOwner) return rawModel;
          if (rawModel.includes("gemma") || rawModel.includes("glm")) return "Weaver Marketing v3 (Custom)";
          if (rawModel.includes("qwen") || rawModel.includes("gpt")) return "Weaver Systems Coder v3 (Custom)";
          return "Weaver Assistant (Custom)";
        };

        // Send initial stats immediately to reset proxy/client connection timeouts
        const initialStats = {
          type: "stats",
          data: {
            model: getMaskedModel(targetModel),
            inputTokens: Math.ceil(
              (typeof message === "string" ? message.length : JSON.stringify(message).length) / 4,
            ),
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
        safeEnqueue(encoder.encode(`data: ${JSON.stringify(initialStats)}\n\n`));

        for (const modelCandidate of modelExecutionList) {
          try {
            console.log(
              `[Agent Router] Attempting stream with model: ${modelCandidate}`,
            );
            const modelInput =
              history && Array.isArray(history) && history.length > 0
                ? [
                    ...history.map((msg: any) => ({
                      role: msg.role === "user" ? "user" : "assistant",
                      content: msg.content,
                    })),
                    { role: "user", content: message },
                  ]
                : message;

            const res = openRouter.callModel({
              model: modelCandidate,
              instructions: systemPrompt,
              input: modelInput,
            });

            // Get async iterator to handle Time to First Token (TTFT) timeout
            const textStream = res.getTextStream();
            const iterator = textStream[Symbol.asyncIterator]();

            // Set a 20-second timeout limit to get the first chunk of data.
            // Free-tier OpenRouter models under load can have a high Time-to-First-Token (TTFT) of 10-20 seconds.
            // Since maxDuration is 60s, a 20s candidate timeout protects against complete hangs while leaving headroom for fallbacks.
            const FIRST_TOKEN_TIMEOUT_MS = 20000;
            const firstResult = await Promise.race([
              iterator.next(),
              new Promise<never>((_, reject) =>
                setTimeout(
                  () => reject(new Error(`Timeout waiting for first token from ${modelCandidate}`)),
                  FIRST_TOKEN_TIMEOUT_MS,
                )
              ),
            ]);

            let chunkResult = firstResult;

            while (!chunkResult.done) {
              const content = chunkResult.value;

              if (!success) {
                success = true;
                selectedModel = modelCandidate;

                // Update client if we successfully connected with a fallback candidate
                if (selectedModel !== targetModel) {
                  const fallbackStats = {
                    type: "stats",
                    data: {
                      model: getMaskedModel(selectedModel),
                    },
                  };
                  safeEnqueue(encoder.encode(`data: ${JSON.stringify(fallbackStats)}\n\n`));
                }
              }

              if (content) {
                fullResponse += content;
                tokenCount++;

                const streamData = {
                  type: "content",
                  data: { content },
                };
                safeEnqueue(encoder.encode(`data: ${JSON.stringify(streamData)}\n\n`));
              }

              chunkResult = await iterator.next();
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
          safeEnqueue(encoder.encode(`data: ${JSON.stringify(errorData)}\n\n`));
          try {
            controller.close();
          } catch {}
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
        safeEnqueue(encoder.encode(`data: ${JSON.stringify(finalStats)}\n\n`));

        console.log(
          `✅ Agent Chat Successful - IP: ${clientIP}, Model: ${selectedModel}, Category: ${routing.category}, Time: ${responseTime}ms`,
        );
        try {
          controller.close();
        } catch {}
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
