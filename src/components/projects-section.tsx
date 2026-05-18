"use client";

import { motion } from "framer-motion";
import type React from "react";
import { useEffect, useRef } from "react";
import { type ProductCardProps, Projects } from "@/data/projects";
import ProjectCard from "./project-card";

interface ProjectsSectionProps {
	projectsRef: React.RefObject<HTMLDivElement | null>;
}

export default function ProjectsSection({ projectsRef }: ProjectsSectionProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (typeof window === "undefined") return;

		const loadGSAP = async () => {
			const gsapModule = await import("gsap");
			const { ScrollTrigger } = await import("gsap/ScrollTrigger");

			gsapModule.gsap.registerPlugin(ScrollTrigger);

			const container = containerRef.current;
			const scrollContainer = scrollContainerRef.current;

			if (!container || !scrollContainer) return;

			const scrollWidth = scrollContainer.scrollWidth;
			const viewportWidth = window.innerWidth;

			gsapModule.gsap.to(scrollContainer, {
				x: -(scrollWidth - viewportWidth + 100),
				ease: "none",
				scrollTrigger: {
					trigger: container,
					start: "top top",
					end: () => `+=${scrollWidth}`,
					scrub: 1,
					pin: true,
					anticipatePin: 1,
					invalidateOnRefresh: true,
				},
			});

			return () => {
				ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
			};
		};

		loadGSAP();
	}, []);

	return (
		<section
			id="projects"
			ref={projectsRef}
			className="relative overflow-hidden bg-background"
		>
			{/* Minimalist Grid Background - Gold Accents */}
			<div
				className="absolute inset-0 opacity-[0.03]"
				style={{
					backgroundImage:
						"linear-gradient(#D4AF37 1px, transparent 1px), linear-gradient(90deg, #D4AF37 1px, transparent 1px)",
					backgroundSize: "60px 60px",
				}}
			/>

			<div
				ref={containerRef}
				className="relative z-10 h-screen flex flex-col justify-center"
			>
				{/* Header */}
				<div className="pt-20 pb-8 px-6 max-w-7xl mx-auto w-full flex-shrink-0">
					<div className="inline-block py-1 px-3 mb-4 border border-accent/20 bg-accent/5 font-mono text-[10px] uppercase tracking-widest text-accent">
						System Architecture
					</div>
					<h2 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter text-white">
						DEPLOYED <span className="text-gold-gradient">PROTOCOLS</span>
						<span className="align-top text-lg md:text-xl text-accent/50 ml-2 font-mono">
							[{Projects.length}]
						</span>
					</h2>
					<p className="text-lg text-foreground/60 max-w-2xl font-light leading-relaxed hidden md:block">
						A selection of personal startups and high-stakes collaborative
						systems. Engineered for{" "}
						<span className="text-gold-gradient font-black">performance</span>,{" "}
						<span className="text-gold-gradient font-black">security</span>, and{" "}
						<span className="text-gold-gradient font-black">scale</span>.
					</p>

					<div className="mt-6 flex items-center gap-4 text-xs text-white/40 font-mono">
						<span>← SCROLL TO EXPLORE →</span>
						<div className="flex-1 h-px bg-gradient-to-r from-accent/20 to-transparent" />
					</div>
				</div>

				{/* Horizontal Scroll Container */}
				<div
					ref={scrollContainerRef}
					className="flex gap-6 pl-6 pr-[50vw] items-center h-[500px]"
				>
					{Projects.map((project, index) => (
						<motion.div
							key={project.title}
							initial={{ opacity: 0, scale: 0.9 }}
							whileInView={{ opacity: 1, scale: 1 }}
							transition={{
								duration: 0.5,
								delay: index * 0.05,
								ease: "easeOut",
							}}
							viewport={{ once: true, margin: "-50px" }}
							className="flex-shrink-0 w-[350px] md:w-[400px] h-[400px] md:h-[450px]"
						>
							<ProjectCard
								title={project.title}
								img={project.img}
								url={project.url}
								description={project.description}
								type={project.type}
								status={project.status}
								techStack={project.techStack}
							/>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}

export { Projects };
