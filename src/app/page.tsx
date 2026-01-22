"use client";

import React, { useEffect, useRef } from "react";
import HireMeForm from "@/components/hire-me-form";
import AnimatedGridBackground from "@/components/animated-grid-background";
import HeroSection from "@/components/hero-section";
import ProjectsSection, { Projects } from "@/components/projects-section";
import SkillsSection from "@/components/skills-section";
import AboutMeSection from "@/components/about-me-section";
import Footer from "@/components/footer";
import StructuredData from "@/components/structured-data";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== "undefined") {
	gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
	const containerRef = useRef<HTMLDivElement>(null);
	const heroRef = useRef<HTMLDivElement>(null);
	const projectsRef = useRef<HTMLDivElement>(null);
	const skillsRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (typeof window === "undefined") return;

		const ctx = gsap.context(() => {
			// Hero section animations with improved performance
			gsap.set(
				[".hero-title", ".hero-subtitle", ".hero-description", ".hero-social"],
				{
					opacity: 0,
					willChange: "transform, opacity",
				},
			);

			const heroTl = gsap.timeline();

			heroTl
				.fromTo(
					".hero-title",
					{ y: 100, opacity: 0 },
					{ y: 0, opacity: 1, duration: 1.2, ease: "power3.out" },
				)
				.fromTo(
					".hero-subtitle",
					{ y: 50, opacity: 0 },
					{ y: 0, opacity: 1, duration: 1, ease: "power3.out" },
					"-=0.9",
				)
				.fromTo(
					".hero-description",
					{ y: 30, opacity: 0 },
					{ y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
					"-=0.6",
				)
				.fromTo(
					".hero-social",
					{ scale: 0, opacity: 0 },
					{ scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" },
					"-=0.3",
				);

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

			// Parallax effect for background elements
			gsap.to(".parallax-slow", {
				yPercent: -50,
				ease: "none",
				scrollTrigger: {
					trigger: containerRef.current,
					start: "top bottom",
					end: "bottom top",
					scrub: true,
				},
			});
		}, containerRef);

		return () => ctx.revert();
	}, []);

	return (
		<div ref={containerRef} className="relative overflow-hidden">
			{/* Structured Data for SEO and AI */}
			<StructuredData
				projects={Projects.map((p) => ({
					title: p.title,
					description: p.description || "",
					url: p.url,
					techStack: p.techStack || [],
				}))}
			/>

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

					{/* AI Models Section - Now available as floating chat button */}

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
