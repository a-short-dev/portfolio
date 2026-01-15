"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type ProductCardProps = {
	title: string;
	img: string;
	url: string;
	type: "contract" | "personal" | "opensource";
	description?: string;
	techStack?: string[];
	status?: "completed" | "maintenance" | "ongoing";
};

const ProjectCard: React.FC<ProductCardProps> = ({
	title,
	img,
	url,
	type,
	description,
	techStack,
	status,
}) => {
	return (
		<Link
			href={url}
			target="_blank"
			rel="noopener noreferrer"
			className="block h-full group"
		>
			<div className="relative flex flex-col h-full bg-black hover-card-gold border border-white/10 group overflow-hidden">
				{/* Image container - Flex Grow */}
				<div className="relative flex-1 w-full min-h-[200px] overflow-hidden border-b border-white/10 group-hover:border-accent/50 transition-colors duration-500">
					<Image
						src={img}
						alt={title}
						fill
						className="object-cover transition-transform duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0 opacity-80 group-hover:opacity-100"
					/>
					{/* Status badge */}
					{status && (
						<div
							className={cn(
								"absolute top-3 right-3 px-3 py-1 text-[9px] font-black uppercase tracking-widest backdrop-blur-md border shadow-lg z-10",
								status === "ongoing"
									? "bg-accent text-black border-accent"
									: "bg-black/80 text-accent border-accent/30",
							)}
						>
							{status}
						</div>
					)}

					{/* Subtle gradient overlay on image */}
					<div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
				</div>

				{/* Content - Fixed Height / Shrink */}
				<div className="h-auto min-h-[160px] flex-shrink-0 p-6 flex flex-col justify-between bg-black relative z-10">
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<span className="text-[10px] font-mono tracking-widest text-accent uppercase font-bold">
								{type}
							</span>
							{/* Arrow Icon */}
							<div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-[-10px] group-hover:translate-x-0">
								<span className="text-accent text-lg">→</span>
							</div>
						</div>

						<h3 className="text-2xl font-black text-white uppercase tracking-tight group-hover:text-accent transition-colors duration-300">
							{title}
						</h3>

						{description && (
							<p className="text-white/60 text-xs leading-relaxed line-clamp-2 font-medium group-hover:text-white/80">
								{description}
							</p>
						)}
					</div>

					{/* Tech stack */}
					{techStack && (
						<div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-accent/10">
							{techStack.map((tech) => (
								<span
									key={tech}
									className="text-[9px] font-mono text-white/40 uppercase tracking-tight group-hover:text-accent/80 transition-colors"
								>
									{tech}
								</span>
							))}
						</div>
					)}
				</div>
			</div>
		</Link>
	);
};

export default ProjectCard;
