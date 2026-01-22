"use client";

import React from "react";
import { motion } from "framer-motion";
import ProjectCard from "./project-card";

export type ProductCardProps = {
	title: string;
	img: string;
	url: string;
	type: "contract" | "personal" | "opensource";
	description?: string;
	techStack?: string[];
	status?: "completed" | "maintenance" | "ongoing";
	className?: string; // For bento grid spans
};

const Projects: ProductCardProps[] = [
	{
		url: "https://useveris.xyz",
		title: "Veris",
		description:
			"Personal startup ecosystem. Architected for scalability and high-availability.",
		img: "/projects/veris.png",
		type: "personal",
		techStack: ["Tanstack Start", "NestJS", "TypeScript", "PostgreSQL", "LLMs"],
		status: "ongoing",
		className: "md:col-span-1 md:row-span-1",
	},
	{
		url: "https://moodjournal.xyz",
		title: "Moodjournal",
		description:
			"Digital well-being platform focusing on privacy and low-latency interaction.",
		img: "/projects/moood-journal.png",
		type: "personal",
		techStack: ["React Native", "TypeScript", "Supabase"],
		status: "ongoing",
		className: "md:col-span-1 md:row-span-1",
	},
	{
		url: "https://novoctplanet.vercel.app/",
		title: "Novoct Planet",
		description:
			"Premium fashion e-commerce platform. Full catalog, cart, and checkout system.",
		img: "/projects/novoct.png",
		type: "contract",
		techStack: ["Next.js", "Prisma", "PostgreSQL", "Tailwind"],
		status: "ongoing",
		className: "md:col-span-1 md:row-span-1",
	},
	{
		url: "https://canwee.vercel.app/",
		title: "Canwee Apartments",
		description:
			"Luxury short-let property management and booking platform for Nigeria.",
		img: "/projects/canwee-apartments.png",
		type: "contract",
		techStack: ["Next.js", "Prisma", "PostgreSQL", "Tailwind"],
		status: "ongoing",
		className: "md:col-span-1 md:row-span-1",
	},
	{
		url: "https://flexiti.vercel.app/",
		title: "Flexiti",
		description:
			"Licensed consumer finance platform offering personal and business loans in Lagos.",
		img: "/projects/flexiti.png",
		type: "contract",
		techStack: ["Next.js", "Prisma", "PostgreSQL", "Tailwind"],
		status: "ongoing",
		className: "md:col-span-1 md:row-span-1",
	},
	{
		url: "https://uvo.vercel.app/",
		title: "UVO",
		description:
			"Digital billboard advertising platform with client dashboard and booking system.",
		img: "/projects/uvo.png",
		type: "contract",
		techStack: ["Next.js", "Prisma", "PostgreSQL", "Tailwind"],
		status: "ongoing",
		className: "md:col-span-1 md:row-span-1",
	},
	{
		url: "https://ubycohub.com/",
		title: "Ubycohub",
		description:
			"High-conversion landing architecture for a tech hub ecosystem.",
		img: "/projects/ubycohub.png",
		type: "contract",
		status: "completed",
		techStack: ["React", "Tailwind", "Framer Motion"],
		className: "md:col-span-1 md:row-span-1",
	},
	{
		url: "#",
		title: "Oyo State Crime Alert",
		description:
			"Mission-critical backend and management dashboard for state security.",
		img: "/projects/oyo-crime.png",
		type: "contract",
		techStack: ["PHP", "Laravel", "MySQL", "React"],
		status: "completed",
		className: "md:col-span-1 md:row-span-1 lg:col-span-2",
	},
	{
		url: "#",
		title: "NCC Tracking System",
		description:
			"Live phone number lookup and tracking infrastructure. Optimized for speed and data throughput.",
		img: "/projects/ncc-track.png",
		type: "contract",
		techStack: ["Python", "Real-time Processing", "Big Data"],
		className: "md:col-span-1 md:row-span-1 lg:col-span-1",
	},
];

interface ProjectsSectionProps {
	projectsRef: React.RefObject<HTMLDivElement | null>;
}

export default function ProjectsSection({ projectsRef }: ProjectsSectionProps) {
	return (
		<section
			id="projects"
			ref={projectsRef}
			className="py-32 relative overflow-hidden bg-background"
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

			<div className="max-w-7xl mx-auto px-6 relative z-10">
				<div className="mb-24">
					<div className="inline-block py-1 px-3 mb-6 border border-accent/20 bg-accent/5 font-mono text-[10px] uppercase tracking-widest text-accent">
						System Architecture
					</div>
					<h2 className="text-4xl md:text-7xl font-black mb-8 tracking-tighter text-white">
						DEPLOYED <span className="text-gold-gradient">PROTOCOLS</span>
					</h2>
					<p className="text-xl text-foreground/60 max-w-2xl font-light leading-relaxed">
						A selection of personal startups and high-stakes collaborative
						systems. Engineered for{" "}
						<span className="text-gold-gradient font-black">performance</span>,{" "}
						<span className="text-gold-gradient font-black">security</span>, and{" "}
						<span className="text-gold-gradient font-black">scale</span>.
					</p>
				</div>

				{/* Updated Grid: Uniform height (500px) manually set via CSS or Tailwind arbitrary value */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
					{Projects.map((project, index) => (
						<motion.div
							key={project.title}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{
								duration: 0.5,
								delay: index * 0.1,
								ease: "easeOut",
							}}
							viewport={{ once: true }}
							className={`${project.className} h-[550px]`}
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
