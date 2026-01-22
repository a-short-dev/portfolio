"use client";

import React, { useRef, useEffect } from "react";
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
		status: "completed",
		className: "md:col-span-1 md:row-span-1 lg:col-span-1",
	},
	{
		url: "https://magic-mediatv.vercel.app/",
		title: "Magic MediaTV",
		description:
			"Film and media production company portfolio with dynamic content showcase.",
		img: "/projects/placeholder.png",
		type: "contract",
		techStack: ["Next.js", "Tailwind", "Framer Motion"],
		status: "completed",
		className: "md:col-span-1 md:row-span-1",
	},
	{
		url: "https://vibe-beige-one.vercel.app/",
		title: "Vibe Protocol",
		description:
			"Premium marketplace for code assets—fullstack apps, workflows, and design systems.",
		img: "/projects/placeholder.png",
		type: "personal",
		techStack: ["Next.js", "Prisma", "PostgreSQL"],
		status: "completed",
		className: "md:col-span-1 md:row-span-1",
	},
	{
		url: "https://www.dessymultipurposecompany.com/",
		title: "Dessy Multipurpose",
		description:
			"Real estate, property development, and agricultural services company website.",
		img: "/projects/placeholder.png",
		type: "contract",
		techStack: ["Next.js", "Tailwind", "TypeScript"],
		status: "completed",
		className: "md:col-span-1 md:row-span-1",
	},
	{
		url: "https://laundry-saas.vercel.app/",
		title: "LaundryPro",
		description:
			"AI-powered SaaS platform for laundry and dry cleaning business management.",
		img: "/projects/placeholder.png",
		type: "personal",
		techStack: ["Next.js", "Prisma", "PostgreSQL", "AI"],
		status: "completed",
		className: "md:col-span-1 md:row-span-1",
	},
	{
		url: "https://joint-item-sharing-app.vercel.app/",
		title: "ShareSpace",
		description:
			"Fair item sharing app for roommates and families with random assignment.",
		img: "/projects/placeholder.png",
		type: "personal",
		techStack: ["Next.js", "Prisma", "PostgreSQL"],
		status: "completed",
		className: "md:col-span-1 md:row-span-1",
	},
];

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
