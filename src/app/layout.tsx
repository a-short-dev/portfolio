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
	title: "Oluwaleke Abiodun",
	description: "Full-stack developer web and mobile developer",
	keywords: [
		"javascript developer, experienced developer, nodejs developer, frontend developer, java developer",
	],
};

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
				<header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-auto max-w-[90vw]">
					<div className="frosted-glass rounded-full px-6 py-3 flex items-center justify-between gap-6 md:gap-8 border border-white/10 shadow-2xl bg-black/50 backdrop-blur-xl">
						<Link href="/" className="group relative flex items-center gap-2">
							<div className="w-2 h-2 bg-accent rounded-full animate-pulse-slow" />
							<span className="font-mono text-xs font-bold tracking-widest text-gold-gradient uppercase group-hover:brightness-110 transition-all duration-300">
								AS_DEV
							</span>
						</Link>

						<div className="w-[1px] h-4 bg-white/10 hidden md:block" />

						<nav className="flex items-center gap-6 md:gap-8">
							<Link
								href="#projects"
								className="text-[10px] uppercase tracking-widest text-white/60 hover:text-accent font-bold transition-colors duration-300"
							>
								Projects
							</Link>
							<Link
								href="#skills-and-tools"
								className="text-[10px] uppercase tracking-widest text-white/60 hover:text-accent font-bold transition-colors duration-300"
							>
								Skills
							</Link>
							<Link
								href="https://devweaver.substack.com"
								target="_blank"
								className="text-[10px] uppercase tracking-widest text-white/60 hover:text-accent font-bold transition-colors duration-300"
							>
								Poems
							</Link>
							<Link
								href="#about"
								className="text-[10px] uppercase tracking-widest text-white/60 hover:text-accent font-bold transition-colors duration-300"
							>
								Cooking
							</Link>
							<Link
								href="#contact"
								className="text-[10px] uppercase tracking-widest text-black bg-accent px-3 py-1.5 rounded-sm font-black hover:bg-white transition-all duration-300"
							>
								Contact
							</Link>
						</nav>
					</div>
				</header>
				{children}
				<FloatingChatButton />
				<SpotifyWidget />
				<Toaster />
			</body>
		</html>
	);
}
