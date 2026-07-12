"use client";

import { motion } from "framer-motion";
import type React from "react";
import { type ProductCardProps, Projects } from "@/data/projects";
import ProjectCard from "./project-card";

interface ProjectsSectionProps {
	projectsRef: React.RefObject<HTMLDivElement | null>;
}

export default function ProjectsSection({ projectsRef }: ProjectsSectionProps) {
	return (
		<section
			id="projects"
			ref={projectsRef}
			className="relative overflow-hidden bg-background py-32"
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

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8">
				{/* Header */}
				<div className="mb-16">
					<div className="inline-block py-1 px-3 mb-4 border border-accent/20 bg-accent/5 font-mono text-[10px] uppercase tracking-widest text-accent">
						Projects & Products
					</div>
					<h2 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter text-white">
						Featured <span className="text-gold-gradient">Work</span>
						<span className="align-top text-lg md:text-xl text-accent/50 ml-2 font-mono">
							[{Projects.length}]
						</span>
					</h2>
					<p className="text-lg text-foreground/60 max-w-2xl font-light leading-relaxed">
						A collection of custom applications and digital products. Built with a focus on speed, beautiful design, and a great user experience.
					</p>
				</div>

				{/* Responsive CSS Grid Layout */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{Projects.map((project, index) => (
						<motion.div
							key={project.title}
							initial={{ opacity: 0, y: 25 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{
								duration: 0.6,
								delay: Math.min(index * 0.08, 0.3),
								ease: "easeOut",
							}}
							viewport={{ once: true, margin: "-50px" }}
							className="w-full h-[400px] md:h-[450px]"
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
