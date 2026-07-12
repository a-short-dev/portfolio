import { type NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { EmailTemplate } from "@/components/widgets/email-template";
import { contactFormSchema } from "@/lib/validation";
import { getClientIP, isRateLimited } from "@/lib/agent/rate-limiter";
import { OWNER_INFO } from "@/lib/constants";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
	const clientIP = getClientIP(req);

	// Limit to 5 emails per hour per IP to prevent spambot abuse
	if (await isRateLimited(clientIP, "email", 5, 60 * 60 * 1000)) {
		return NextResponse.json(
			{ error: "Too many messages sent. Please wait a while before trying again." },
			{ status: 429 }
		);
	}

	try {
		const body = await req.json();
		const parsed = contactFormSchema.safeParse(body);
		if (!parsed.success) {
			return NextResponse.json(
				{ error: "Invalid form input data.", details: parsed.error.format() },
				{ status: 400 }
			);
		}

		const { name, email, message } = parsed.data;

		if (!process.env.RESEND_API_KEY) {
			return NextResponse.json(
				{ error: "Email service is not configured currently." },
				{ status: 500 }
			);
		}

		const { data, error } = await resend.emails.send({
			from: "onboarding@resend.dev",
			to: OWNER_INFO.email,
			subject: `Project Inquiry from ${name}`,
			react: EmailTemplate({
				name,
				email,
				message,
			}),
		});

		if (error) {
			console.error("Email send API Resend error:", error);
			return NextResponse.json(
				{ error: "Failed to send the message. Please try again later." },
				{ status: 500 }
			);
		}

		return NextResponse.json({ success: true });
	} catch (error: any) {
		console.error("Email send API unexpected error:", error?.message || error);
		return NextResponse.json(
			{ error: "An unexpected error occurred while processing your request." },
			{ status: 500 }
		);
	}
}
