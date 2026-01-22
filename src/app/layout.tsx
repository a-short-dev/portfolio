import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Link from "next/link";
import { Toaster } from "sonner";
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
	metadataBase: new URL("https://oluwaleke.dev"),
	title: {
		default: "Oluwaleke Abiodun | Full Stack Software Engineer",
		template: "%s | Oluwaleke Abiodun",
	},
	description:
		"Polyglot software engineer specializing in React, Next.js, React Native, Node.js, and Python. Building scalable web apps, mobile apps, and backend systems.",
	keywords: [
		"Oluwaleke Abiodun",
		"Full Stack Developer",
		"Software Engineer",
		"React Developer",
		"Next.js Developer",
		"React Native Developer",
		"Node.js Developer",
		"TypeScript Developer",
		"Python Developer",
		"Mobile App Developer",
		"Web Developer Nigeria",
		"Freelance Developer",
		"API Development",
		"PostgreSQL",
		"Prisma",
		"NestJS",
	],
	authors: [{ name: "Oluwaleke Abiodun", url: "https://oluwaleke.dev" }],
	creator: "Oluwaleke Abiodun",
	publisher: "Oluwaleke Abiodun",
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
		url: "https://oluwaleke.dev",
		siteName: "Oluwaleke Abiodun",
		title: "Oluwaleke Abiodun | Full Stack Software Engineer",
		description:
			"Polyglot software engineer building scalable web apps, mobile apps, and backend systems with React, Next.js, and Node.js.",
		images: [
			{
				url: "/og-image.png",
				width: 1200,
				height: 630,
				alt: "Oluwaleke Abiodun - Full Stack Software Engineer",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Oluwaleke Abiodun | Full Stack Software Engineer",
		description:
			"Polyglot software engineer building scalable web apps, mobile apps, and backend systems.",
		creator: "@a_short_dev",
		images: ["/og-image.png"],
	},
	alternates: {
		canonical: "https://oluwaleke.dev",
	},
	category: "technology",
};

import Navbar from "@/components/navbar";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="scroll-smooth">
			<body
				className={`${geistSans.variable} ${geistMono.variable} ${marlish.variable} ${open_sans.variable} w-full dark:bg-slate-950 bg-background text-foreground antialiased min-h-screen font-sans`}
			>
				<Navbar />
				{children}
				<FloatingChatButton />
				<SpotifyWidget />
				<Toaster />
			</body>
		</html>
	);
}
