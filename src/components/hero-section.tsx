"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { FaGithub, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { gsap } from "gsap";

interface HeroSectionProps {
	heroRef: React.RefObject<HTMLDivElement | null>;
}

export default function HeroSection({ heroRef }: HeroSectionProps) {
	const titleRef = useRef<HTMLHeadingElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (typeof window === "undefined") return;

		const ctx = gsap.context(() => {
			gsap.fromTo(
				titleRef.current,
				{ opacity: 0, y: 30, letterSpacing: "0.1em" },
				{
					opacity: 1,
					y: 0,
					letterSpacing: "-0.04em",
					duration: 1.5,
					ease: "power3.out",
					delay: 0.1,
				},
			);

			gsap.fromTo(
				".hero-animate",
				{ opacity: 0, y: 10 },
				{
					opacity: 1,
					y: 0,
					duration: 1,
					stagger: 0.1,
					ease: "power2.out",
					delay: 0.6,
				},
			);
		}, contentRef);

		return () => ctx.revert();
	}, []);

	return (
		<section
			ref={heroRef}
			className="w-full flex items-center min-h-screen justify-center relative overflow-hidden pt-52 pb-24 bg-background"
		>
			{/* Minimalist Grid Overlay - Gold Accent */}
			<div
				className="absolute inset-0 opacity-[0.03]"
				style={{
					backgroundImage:
						"linear-gradient(hsl(var(--accent)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--accent)) 1px, transparent 1px)",
					backgroundSize: "80px 80px",
				}}
			/>

			<div
				ref={contentRef}
				className="text-center max-w-6xl mx-auto relative z-10 px-4 sm:px-6 lg:px-8"
			>
				<div className="mb-12 hero-animate">
					<span className="inline-block py-2 px-4 mb-8 bg-accent/5 text-accent text-[11px] uppercase tracking-[0.3em] font-black border border-accent/20 animate-pulse-slow">
						System_Active
					</span>

					<h1
						ref={titleRef}
						className="text-6xl sm:text-8xl md:text-9xl font-black leading-[0.85] tracking-tighter mb-4 text-gold-gradient drop-shadow-2xl"
					>
						a_short_dev
					</h1>

					<h2 className="text-xl sm:text-3xl font-bold tracking-[0.2em] text-white/80 uppercase mb-8">
						<span className="text-accent">POLYGLOT</span> ENGINEER
					</h2>

					<div className="hero-animate space-y-2">
						<p className="text-sm sm:text-base font-mono tracking-[0.2em] uppercase text-foreground/60 w-full max-w-lg mx-auto border-t border-b border-white/5 py-4">
							Performance • Low Memory • Security
						</p>
					</div>
				</div>

				<div className="hero-animate max-w-2xl mx-auto space-y-12 mb-20 animate-fade-in">
					<p className="text-xl sm:text-2xl font-light leading-relaxed text-foreground/80">
						Designing high-performance native and web ecosystems. Focusing on
						memory efficiency and secure architecture for
						<span className="text-accent font-medium ml-2 border-b border-accent/20 pb-0.5">
							scalable startups
						</span>
						.
					</p>

					<div className="flex items-center justify-center gap-6 text-[10px] font-bold tracking-widest text-foreground/40">
						<span className="hover:text-accent transition-colors cursor-default">
							KOTLIN
						</span>
						<span className="w-1 h-1 bg-accent/40 rounded-full" />
						<span className="hover:text-accent transition-colors cursor-default">
							SWIFT
						</span>
						<span className="w-1 h-1 bg-accent/40 rounded-full" />
						<span className="hover:text-accent transition-colors cursor-default">
							RUST
						</span>
						<span className="w-1 h-1 bg-accent/40 rounded-full" />
						<span className="hover:text-accent transition-colors cursor-default">
							TYPESCRIPT
						</span>
					</div>
				</div>

				<div className="hero-animate flex items-center justify-center gap-8">
					<Link
						href="https://github.com/a-short-dev"
						target="_blank"
						className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-bold tracking-wider text-xs uppercase hover:bg-accent hover:text-white transition-all duration-300 font-mono"
					>
						<FaGithub size={18} />
						<span>GitHub Access</span>
					</Link>

					<div className="flex items-center gap-6">
						<Link
							href="https://www.linkedin.com/in/ashortdev/"
							target="_blank"
							className="text-foreground/40 hover:text-accent transition-colors duration-300"
						>
							<FaLinkedinIn size={24} />
						</Link>
						<Link
							href="https://x.com/a_short_dev"
							target="_blank"
							className="text-foreground/40 hover:text-accent transition-colors duration-300"
						>
							<FaXTwitter size={24} />
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
}
