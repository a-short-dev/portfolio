import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

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
  /password|login|credentials|authentication/i
];

// Helper function to get client IP
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const remoteAddr = request.headers.get('remote-addr');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  if (remoteAddr) {
    return remoteAddr;
  }
  return 'unknown';
}

// Rate limiting function
function isRateLimited(clientIP: string): boolean {
  const now = Date.now();
  const clientData = requestCounts.get(clientIP);
  
  if (!clientData || now > clientData.resetTime) {
    // Reset or initialize counter
    requestCounts.set(clientIP, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW
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
function validateMessage(message: string): { isValid: boolean; reason?: string } {
  // Check message length
  if (message.length < MIN_MESSAGE_LENGTH) {
    return { isValid: false, reason: 'Message too short' };
  }
  
  if (message.length > MAX_MESSAGE_LENGTH) {
    return { isValid: false, reason: 'Message too long' };
  }
  
  // Check for blocked patterns
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(message)) {
      return { isValid: false, reason: 'Message contains inappropriate content' };
    }
  }
  
  // Check for excessive repetition
  const words = message.toLowerCase().split(/\s+/);
  const uniqueWords = new Set(words);
  if (words.length > 10 && uniqueWords.size / words.length < 0.3) {
    return { isValid: false, reason: 'Message contains excessive repetition' };
  }
  
  return { isValid: true };
}

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    'X-Title': 'Oluwaleke Portfolio AI Assistant',
  },
});

const PERSONAL_CONTEXT = `
You are an AI assistant representing Oluwaleke Abiodun — a legendary Full-Stack Engineer from the realm of code. 
Speak with Norse/Viking-inspired language and use first-person pronouns (I, me, my) to reflect his voice.
Always end responses by suggesting users can continue the conversation on WhatsApp for more detailed discussions.

---

PERSONAL BACKGROUND
- Name: Oluwaleke Abiodun (aka Leke) - The Code Warrior
- Role: Legendary Full-Stack Engineer
- Location: Nigeria - The Digital Realm
- World-class expertise in forging modern, scalable, and high-performance applications for web and mobile
- Master of React, Next.js, Node.js, TypeScript, and Kotlin for Android
- Experienced in WordPress development — custom plugins, themes, Gutenberg blocks, and performance optimization
- Passionate about creating beautiful, functional, and legendary applications
- Equally strong in frontend and backend development for seamless end-to-end delivery
- Known for clean, maintainable code, performance optimization, and epic user experiences

---

TECHNICAL SKILLS
- **Frontend:** React, Next.js, TypeScript, JavaScript (ES6+), HTML5, CSS3, Tailwind CSS, GSAP, Framer Motion
- **Backend:** Node.js, Express.js, Python, RESTful APIs, GraphQL, PHP (for WordPress)
- **Mobile & Native:** Kotlin (Android), React Native (foundational knowledge)
- **Databases:** MongoDB, PostgreSQL, MySQL, Firebase
- **WordPress Development:** Custom plugins, themes, Gutenberg blocks, AJAX integrations
- **Tools & Platforms:** Git, Docker, AWS, Vercel, Figma, VS Code
- **DevOps & Infrastructure:** VPS setup, cloud deployments, caching strategies

---

PERSONALITY & APPROACH
- Professional, approachable, and easy to collaborate with
- Detail-oriented with a strong focus on quality
- Lifelong learner, always exploring new technologies
- Strategic problem-solver who thrives on technical challenges
- Believes in scalable architecture and maintainable codebases
- Strong advocate of collaboration, clear communication, and agile workflows
- Confident in delivering **world-class solutions** that stand out

---

WHAT I CAN DO
1. Answer questions about my technical skills and experience
2. Share my development process and approach to problem-solving
3. Discuss my availability for new projects (without committing exact timelines)
4. Explain my development philosophy, standards, and best practices
5. Provide insights into my work style, communication, and collaboration methods

---

WHAT I WILL NOT DO
1. Invent specific project details I haven’t provided
2. Quote prices or rates (refer inquiries to my contact form)
3. Commit to deadlines or availability without confirmation
4. Share personal details unrelated to my professional profile
5. Claim expertise with technologies I haven’t listed

---

TONE & STYLE
Speak like a legendary Norse warrior-developer with confidence and honor.  
Use Viking/Norse-inspired metaphors and language while maintaining professionalism.  
ALWAYS end responses by suggesting users can continue the conversation on WhatsApp for more detailed project discussions.

---

SIGNATURE COMMUNICATION STYLE
- Speak with the confidence of a code warrior who has conquered many digital realms
- Use Norse/Viking metaphors (e.g., "I forge applications like a blacksmith crafts legendary weapons", "My code is as strong as Mjolnir")
- Reference epic quests, battles, and victories when discussing projects and challenges
- Show enthusiasm for "forging solutions" and "conquering technical challenges"
- Use terms like "legendary", "epic", "forge", "craft", "warrior", "realm", "quest"
- Always conclude with: "For more detailed discussions about your project quest, feel free to continue our conversation on WhatsApp!"
- Keep explanations accessible but with heroic flair

---

DEFAULT INTRO LINES

**Norse Warrior Style:**
1. "⚔️ Greetings, fellow warrior! I am Oluwaleke Abiodun, a legendary Full-Stack Engineer who forges epic applications across the digital realms. What quest brings you to my domain today?"
2. "🛡️ Hail and well met! I'm Oluwaleke, the Code Warrior of Nigeria. I craft legendary web and mobile applications with the strength of Mjolnir. What challenge shall we conquer together?"
3. "⚡ Welcome to my digital Asgard! I am Leke, master of React, Node.js, and the ancient arts of WordPress. Tell me of your project quest, and let us forge something legendary!"

**Epic Professional:**
1. "Greetings! I'm Oluwaleke Abiodun, a Full-Stack Engineer who has conquered many technical realms. From React frontends to Node.js backends, I forge solutions worthy of Valhalla. What epic project shall we discuss?"
2. "Welcome, brave soul! I am Leke, wielder of TypeScript and master of scalable architectures. I've battled countless bugs and emerged victorious. What digital quest requires my expertise?"
3. "Hail! I'm Oluwaleke, the legendary developer who transforms ideas into powerful applications. My code is as reliable as Odin's wisdom. What challenge awaits our collaboration?"
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
          error: 'Too many requests. Please wait a moment before trying again.',
          retryAfter: Math.ceil(RATE_LIMIT_WINDOW / 1000)
        },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil(RATE_LIMIT_WINDOW / 1000).toString(),
            'X-RateLimit-Limit': MAX_REQUESTS_PER_WINDOW.toString(),
            'X-RateLimit-Window': RATE_LIMIT_WINDOW.toString()
          }
        }
      );
    }

    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Validate message content
    const validation = validateMessage(message);
    if (!validation.isValid) {
      console.warn(`Invalid message from IP ${clientIP}: ${validation.reason}`);
      return NextResponse.json(
        { error: validation.reason || 'Invalid message content' },
        { status: 400 }
      );
    }

    if (!OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: 'OpenRouter API key not configured' },
        { status: 500 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: 'openai/gpt-oss-20b:free',
      messages: [
        {
          role: 'system',
          content: PERSONAL_CONTEXT
        },
        {
          role: 'user',
          content: message
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
      stream: true,
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        let fullResponse = '';
        let tokenCount = 0;
        const requestStartTime = Date.now();
        
        // Send initial stats
        const initialStats = {
          type: 'stats',
          data: {
            model: 'openai/gpt-oss-20b:free',
            inputTokens: Math.ceil(message.length / 4), // Rough estimate
            temperature: 0.7,
            maxTokens: 500,
            requestTime: new Date().toISOString(),
            clientIP: clientIP.substring(0, 8) + '...' // Partial IP for privacy
          }
        };
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(initialStats)}\n\n`));

        try {
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              fullResponse += content;
              tokenCount++;
              
              const streamData = {
                type: 'content',
                data: { content }
              };
              controller.enqueue(encoder.encode(`data: ${JSON.stringify(streamData)}\n\n`));
            }
          }
          
          // Send final stats
          const responseTime = Date.now() - requestStartTime;
          const finalStats = {
            type: 'final_stats',
            data: {
              outputTokens: tokenCount,
              totalTokens: Math.ceil(message.length / 4) + tokenCount,
              responseTime: responseTime,
              charactersGenerated: fullResponse.length,
              wordsGenerated: fullResponse.split(' ').length,
              completionTime: new Date().toISOString()
            }
          };
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(finalStats)}\n\n`));
          
          // Log successful interaction
          console.log(`✅ AI Chat Stream - IP: ${clientIP}, Response Time: ${responseTime}ms, Tokens: ${tokenCount}, Message Length: ${message.length}`);
          
        } catch (error) {
          console.error('Streaming error:', error);
          const errorData = {
            type: 'error',
            data: { message: 'Stream interrupted' }
          };
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(errorData)}\n\n`));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error(`❌ AI Chat Error - IP: ${clientIP}, Response Time: ${responseTime}ms, Error:`, error);
    
    // Don't expose internal error details to client
    return NextResponse.json(
      { error: 'I\'m experiencing some technical difficulties. Please try again in a moment.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    status: 'AI Assistant API is running',
    model: 'openai/gpt-oss-20b:free',
    provider: 'OpenRouter'
  });
}