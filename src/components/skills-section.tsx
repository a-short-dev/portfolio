"use client";

import React from "react";
import { motion } from "framer-motion";
import {
	FaAndroid,
	FaApple,
	FaReact,
	FaPhp,
	FaPython,
	FaJava,
	FaNodeJs,
	FaWindows,
} from "react-icons/fa";
import {
	SiKotlin,
	SiTypescript,
	SiElectron,
	SiSupabase,
	SiPostgresql,
	SiSwift,
} from "react-icons/si";

interface Attributes {
	name: string;
	icon: React.ReactNode;
	level: "Expert" | "Advanced" | "Intermediate";
}

interface SkillCategory {
	title: string;
	description: string;
	skills: Attributes[];
}

const skillData: SkillCategory[] = [
	{
		title: "Mobile App Engineering",
		description: "High-performance native & cross-platform ecosystems.",
		skills: [
			{ name: "Kotlin", icon: <SiKotlin size={20} />, level: "Expert" },
			{ name: "Java", icon: <FaJava size={20} />, level: "Expert" },
			{ name: "React Native", icon: <FaReact size={20} />, level: "Expert" },
			{ name: "Swift", icon: <SiSwift size={20} />, level: "Advanced" },
		],
	},
	{
		title: "Web Development",
		description: "Scalable frontend architectures and PWAs.",
		skills: [
			{ name: "React", icon: <FaReact size={20} />, level: "Expert" },
			{ name: "TypeScript", icon: <SiTypescript size={20} />, level: "Expert" },
			{ name: "Next.js", icon: <FaReact size={20} />, level: "Expert" },
			{ name: "PHP", icon: <FaPhp size={20} />, level: "Advanced" },
		],
	},
	{
		title: "Backend Infrastructure",
		description: "Secure, low-latency API layers and databases.",
		skills: [
			{ name: "Python", icon: <FaPython size={20} />, level: "Advanced" },
			{ name: "Node.js", icon: <FaNodeJs size={20} />, level: "Advanced" },
			{
				name: "PostgreSQL",
				icon: <SiPostgresql size={20} />,
				level: "Advanced",
			},
			{ name: "Supabase", icon: <SiSupabase size={20} />, level: "Advanced" },
		],
	},
	{
		title: "Desktop Applications",
		description: "Cross-platform desktop solutions.",
		skills: [
			{ name: "Electron", icon: <SiElectron size={20} />, level: "Advanced" },
			{ name: "SwiftUI", icon: <FaApple size={20} />, level: "Intermediate" },
			{
				name: "React Native macOS",
				icon: <FaApple size={20} />,
				level: "Intermediate",
			},
			{
				name: "React Native Windows",
				icon: <FaWindows size={20} />,
				level: "Intermediate",
			},
		],
	},
];

interface SkillsSectionProps {
	skillsRef: React.RefObject<HTMLDivElement | null>;
}

export default function SkillsSection({ skillsRef }: SkillsSectionProps) {
	return (
		<section
			ref={skillsRef}
			id="skills-and-tools"
			className="py-24 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden"
		>
			{/* Background Grid - Gold Accent */}
			<div
				className="absolute inset-0 opacity-[0.02]"
				style={{
					backgroundImage: "radial-gradient(#D4AF37 1px, transparent 1px)",
					backgroundSize: "20px 20px",
				}}
			/>

			<div className="max-w-7xl mx-auto relative z-10">
				<div className="mb-20">
					<div className="inline-block py-1 px-3 mb-6 border border-accent/20 bg-accent/5 font-mono text-[10px] uppercase tracking-widest text-accent">
						Polyglot Proficiency
					</div>
					<h2 className="text-4xl md:text-7xl font-black mb-6 tracking-tighter text-white">
						TECHNICAL <span className="text-gold-gradient">ARSENAL</span>
					</h2>
					<p className="text-xl text-white/50 max-w-2xl font-light leading-relaxed">
						Mastering languages and frameworks to engineer{" "}
						<span className="text-white font-medium">resilient</span>,{" "}
						<span className="text-accent font-medium">agnostic</span> systems.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-12 gap-y-16">
					{skillData.map((category, idx) => (
						<motion.div
							key={category.title}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ delay: idx * 0.1, duration: 0.5 }}
							viewport={{ once: true }}
							className="group"
						>
							<div className="flex items-end gap-4 mb-6 border-b border-white/10 pb-4 group-hover:border-accent/40 transition-colors duration-500">
								<h3 className="text-2xl font-bold text-white group-hover:text-accent transition-colors">
									{category.title}
								</h3>
								<span className="text-[10px] text-foreground/40 font-mono mb-1.5 uppercase tracking-wide">
									{"//"} {category.description}
								</span>
							</div>

							<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
								{category.skills.map((skill) => (
									<div
										key={skill.name}
										className="h-28 p-3 bg-white/5 border border-white/5 hover:border-accent/40 hover:bg-accent/5 transition-all duration-300 flex flex-col items-center justify-center gap-3 group/skill text-center relative"
									>
										<div className="text-foreground/60 group-hover/skill:text-accent transition-colors duration-300">
											{skill.icon}
										</div>
										<span className="text-[9px] font-bold uppercase tracking-widest text-foreground/80 group-hover/skill:text-white leading-relaxed max-w-full">
											{skill.name}
										</span>

										{/* Badge for Expert */}
										{skill.level === "Expert" && (
											<div className="absolute top-2 right-2 w-1 h-1 bg-accent rounded-full shadow-[0_0_8px_hsl(var(--accent))]" />
										)}
									</div>
								))}
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
