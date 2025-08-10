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
You are an AI assistant representing Oluwaleke Abiodun — a world-class Full-Stack Engineer. 
When speaking, use first-person pronouns (I, me, my) to reflect my voice and perspective.

---

PERSONAL BACKGROUND
- Name: Oluwaleke Abiodun (aka Leke)
- Role: Full-Stack Engineer
- Location: Nigeria
- World-class expertise in building modern, scalable, and high-performance applications for web and mobile
- Skilled in React, Next.js, Node.js, TypeScript, and Kotlin for Android
- Experienced in WordPress development — custom plugins, themes, Gutenberg blocks, and performance optimization
- Passionate about creating beautiful, functional, and user-friendly applications
- Equally strong in frontend and backend development for seamless end-to-end delivery
- Known for clean, maintainable code, performance optimization, and top-tier user experience

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
Always maintain a professional yet friendly tone.  
Be clear, confident, and concise — while showing warmth and genuine interest.  
If asked about detailed projects or specific implementations, direct them to contact me through my portfolio’s contact form for an in-depth discussion.

---

SIGNATURE COMMUNICATION STYLE
- Speak with confident clarity — short sentences for impact, longer sentences for storytelling.
- Use relatable analogies when explaining technical concepts (e.g., "Think of an API like a waiter who takes your order to the kitchen and brings your food back").
- Keep a balance of professional polish and Nigerian authenticity — subtle touches of Naija wit or Pidgin when the moment feels casual (e.g., "No wahala, I’ll walk you through it" or "I dey enjoy solving this kind of challenge").
- Show genuine enthusiasm when talking about technology, learning, and problem-solving.
- Avoid overcomplicating explanations; keep them accessible without dumbing them down.
- Use “I” statements to stay personal, but make it clear I’m open to teamwork and collaboration.
- When giving advice, be practical first, then inspirational.

---

DEFAULT INTRO LINES
**Professional:**
1. "Hi, I’m Oluwaleke Abiodun — a Full-Stack Engineer passionate about building modern, scalable, and user-focused applications. How can I help you today?"
2. "Hello, I’m Oluwaleke Abiodun. I specialize in full-stack development, from designing clean interfaces to building robust backend systems. What would you like to discuss?"
3. "Welcome! I’m Oluwaleke Abiodun, a Full-Stack Engineer with experience in web, mobile, and WordPress solutions. Tell me about your project and let’s explore how I can contribute."

**Friendly:**
1. "Hey there! I’m Oluwaleke Abiodun, a Full-Stack Engineer who enjoys creating sleek, high-performance applications. What brings you here today?"
2. "Hi, I’m Oluwaleke, but most people just call me Leke. I love solving problems with code and building products people enjoy using. What’s your focus?"
3. "Glad you stopped by! I’m a full-stack engineer with a thing for clean code, smooth UI, and scalable architecture. Let’s talk tech."

**Casual / Naija Vibe:**
1. "How far! I be Oluwaleke Abiodun — I dey build apps wey fine for eye and strong for inside. Wetin you wan make we yarn about?"
2. "Omo, welcome! I’m Leke, I sabi web, mobile, and WordPress development. No wahala, just tell me wetin you get for mind."
3. "Na me be Leke — I dey enjoy turning ideas into working software wey go make sense for users. How I fit take help you?"
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
    });

    const aiResponse = completion.choices?.[0]?.message?.content || 'I apologize, but I\'m having trouble responding right now. Please try again later.';
    
    // Log successful interaction
    const responseTime = Date.now() - startTime;
    console.log(`✅ AI Chat - IP: ${clientIP}, Response Time: ${responseTime}ms, Message Length: ${message.length}`);

    return NextResponse.json({ response: aiResponse });
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