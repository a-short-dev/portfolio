import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "sonner";
import { headers } from "next/headers";
import dynamic from "next/dynamic";
import { DOMAINS, OWNER_INFO } from "@/lib/constants";
import FloatingChatButton from "@/components/floating-chat-button";
import SpotifyWidget from "@/components/spotify-widget";

const geistSans = localFont({
	src: "./fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900",
});
const geistMono = localFont({
	src: "./fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900",
});

const marlish = localFont({
	src: "./fonts/Mulish/Mulish-VariableFont_wght.ttf",
	variable: "--font-marlish",
	weight: "100 900",
});

const open_sans = localFont({
	src: "./fonts/Open_Sans/OpenSans-VariableFont_wdth,wght.ttf",
	variable: "--font-open-sans",
	weight: "100 900",
});

export const metadata: Metadata = {
	metadataBase: new URL(DOMAINS.canonical),
	title: {
		default: `${OWNER_INFO.name} | ${OWNER_INFO.title}`,
		template: `%s | ${OWNER_INFO.name}`,
	},
	description:
		"Polyglot software engineer and founder specializing in high-performance native (Kotlin, Swift) and web (React, Next.js, Node.js, Rust) systems. Currently bootstrapping a next-generation software product.",
	keywords: [
		OWNER_INFO.name,
		OWNER_INFO.brand,
		"Polyglot Engineer",
		"Software Founder",
		"Bootstrapped Startup",
		"Co-founder Search",
		"React Developer",
		"Next.js Developer",
		"Kotlin Developer",
		"Swift Developer",
		"Rust Developer",
		"TypeScript Developer",
		"Node.js Developer",
		"Python Developer",
		"Mobile App Developer",
		"API Development",
		"PostgreSQL",
	],
	authors: [
		{ name: OWNER_INFO.name, url: DOMAINS.canonical },
	],
	creator: OWNER_INFO.name,
	publisher: OWNER_INFO.name,
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	openGraph: {
		type: "website",
		locale: "en_US",
		url: DOMAINS.canonical,
		siteName: OWNER_INFO.name,
		title: `${OWNER_INFO.name} | ${OWNER_INFO.title}`,
		description:
			"Polyglot software engineer building scalable native apps, web apps, and backend systems with Kotlin, Swift, React, and Rust.",
		images: [
			{
				url: "/og-image.png",
				width: 1200,
				height: 630,
				alt: `${OWNER_INFO.name} - ${OWNER_INFO.title}`,
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: `${OWNER_INFO.name} | ${OWNER_INFO.title}`,
		description:
			"Polyglot software engineer building high-performance systems and bootstrapping products.",
		creator: `@${OWNER_INFO.brand}`,
		images: ["/og-image.png"],
	},
	alternates: {
		canonical: DOMAINS.canonical,
	},
	category: "technology",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const headersList = await headers();
	const nonce = headersList.get("x-nonce") || undefined;

	return (
		<html lang="en" className="scroll-smooth" suppressHydrationWarning={true}>
			<body
				className={`${geistSans.variable} ${geistMono.variable} ${marlish.variable} ${open_sans.variable} w-full dark:bg-slate-950 bg-background text-foreground antialiased min-h-screen font-sans`}
			>
				{children}
				<FloatingChatButton />
				<SpotifyWidget />
				<Toaster />
				<Analytics />
				<SpeedInsights />
			</body>
		</html>
	);
}
