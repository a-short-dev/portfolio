"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import React, { useEffect, useRef } from "react";
import AboutMeSection from "@/components/about-me-section";
import AnimatedGridBackground from "@/components/animated-grid-background";
import Footer from "@/components/footer";
import HeroSection from "@/components/hero-section";
import HireMeForm from "@/components/hire-me-form";
import ProjectsSection from "@/components/projects-section";
import SkillsSection from "@/components/skills-section";

// Register GSAP plugins
if (typeof window !== "undefined") {
	gsap.registerPlugin(ScrollTrigger);
}

export default function HomeClient() {
	const containerRef = useRef<HTMLDivElement>(null);
	const heroRef = useRef<HTMLDivElement>(null);
	const projectsRef = useRef<HTMLDivElement>(null);
	const skillsRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (typeof window === "undefined") return;

		const ctx = gsap.context(() => {
			// Scroll-triggered animations for sections
			gsap.utils.toArray(".section-reveal").forEach((section: any) => {
				gsap.fromTo(
					section,
					{ y: 100, opacity: 0 },
					{
						y: 0,
						opacity: 1,
						duration: 1,
						ease: "power3.out",
						scrollTrigger: {
							trigger: section,
							start: "top 80%",
							end: "bottom 20%",
							toggleActions: "play none none reverse",
						},
					},
				);
			});

			// Optimized card hover animations
			gsap.utils.toArray(".card-hover").forEach((card: any) => {
				const glow = card.querySelector(".card-glow");

				gsap.set(card, { willChange: "transform" });
				gsap.set(glow, { willChange: "opacity" });

				const tl = gsap.timeline({ paused: true });
				tl.to(card, {
					scale: 1.05,
					duration: 0.2,
					ease: "power2.out",
					force3D: true,
				}).to(
					glow,
					{
						opacity: 1,
						duration: 0.2,
					},
					0,
				);

				card.addEventListener("mouseenter", () => {
					tl.timeScale(1).play();
				});
				card.addEventListener("mouseleave", () => {
					tl.timeScale(1.5).reverse();
				});
			});

		}, containerRef);

		return () => ctx.revert();
	}, []);

	return (
		<div ref={containerRef} className="relative overflow-hidden">
			{/* Animated Grid Background */}
			<AnimatedGridBackground />

			<div className="relative z-10 w-full">
				<main>
					{/* Hero Section */}
					<HeroSection heroRef={heroRef} />

					{/* Projects Section */}
					<ProjectsSection projectsRef={projectsRef} />

					{/* Skills Section */}
					<SkillsSection skillsRef={skillsRef} />

					{/* About Me Section */}
					<AboutMeSection />

					{/* Contact Form */}
					<section id="contact" className="section-reveal py-32">
						<HireMeForm />
					</section>

					{/* Footer */}
					<Footer />
				</main>
			</div>
		</div>
	);
}
