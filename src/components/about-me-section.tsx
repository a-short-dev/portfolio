"use client";

import { motion } from "framer-motion";
import React from "react";
import { FaFeatherAlt, FaUtensils } from "react-icons/fa";
import { SiSubstack } from "react-icons/si";

export default function AboutMeSection() {
	return (
		<section
			id="about"
			className="py-32 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden"
		>
			{/* Ambient Background */}
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

			<div className="max-w-5xl mx-auto relative z-10">
				{/* Header */}
				<div className="mb-20 text-center">
					<div className="inline-block py-1 px-3 mb-6 border border-accent/20 bg-accent/5 font-mono text-[10px] uppercase tracking-widest text-accent">
						My Life Beyond Code
					</div>
					<h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter text-white">
						Life Beyond <span className="text-gold-gradient">Coding</span>
					</h2>
					<p className="text-xl text-white/50 max-w-2xl mx-auto font-light leading-relaxed">
						When I'm not building software, I focus my energy on writing and the culinary arts.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-12">
					{/* The Weaver (Poetry) */}
					<motion.div
						initial={{ opacity: 0, x: -50 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8, ease: "easeOut" }}
						viewport={{ once: true }}
						className="relative p-8 group border border-white/5 hover:border-accent/30 bg-white/[0.02] transition-all duration-500 hover:bg-white/[0.04]"
					>
						<div className="absolute top-0 left-0 w-1 h-full bg-accent/20 group-hover:bg-accent transition-colors duration-500" />

						<div className="flex items-center gap-4 mb-6">
							<div className="p-3 bg-white/5 rounded-full text-accent group-hover:scale-110 transition-transform duration-300">
								<FaFeatherAlt size={24} />
							</div>
							<h3 className="text-2xl font-bold text-white uppercase tracking-tight">
								Creative Writing
							</h3>
						</div>

						<p className="text-white/60 leading-relaxed mb-8">
							Under the pen name <span className="text-accent font-medium">@devweaver</span> on Substack, I write reflections, essays, and creative pieces exploring technology, society, and modern life. Writing helps me organize my thoughts and share ideas with others.
						</p>

						<div className="flex flex-col gap-4">
							<a
								href="https://devweaver.substack.com"
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/40 hover:text-accent transition-colors group/link"
							>
								<SiSubstack />
								<span>Visit my substack</span>
								<span className="transform group-hover/link:translate-x-1 transition-transform">
									→
								</span>
							</a>

							<a
								href="https://devweaver.substack.com/p/one-life"
								target="_blank"
								rel="noopener noreferrer"
								className="inline-block text-[10px] border-l-2 border-accent/20 pl-3 py-1 text-white/40 hover:text-accent transition-colors font-mono italic"
							>
								Featured essay: "One Life" — A reflection on existence.
							</a>
						</div>
					</motion.div>

					{/* The Culinarian (Cooking) */}
					<motion.div
						initial={{ opacity: 0, x: 50 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
						viewport={{ once: true }}
						className="relative p-8 group border border-white/5 hover:border-accent/30 bg-white/[0.02] transition-all duration-500 hover:bg-white/[0.04]"
					>
						<div className="absolute top-0 right-0 w-1 h-full bg-accent/20 group-hover:bg-accent transition-colors duration-500" />

						<div className="flex items-center gap-4 mb-6 justify-end text-right">
							<h3 className="text-2xl font-bold text-white uppercase tracking-tight">
								Culinary Arts
							</h3>
							<div className="p-3 bg-white/5 rounded-full text-accent group-hover:scale-110 transition-transform duration-300">
								<FaUtensils size={24} />
							</div>
						</div>

						<p className="text-white/60 leading-relaxed mb-8 text-right">
							Cooking is my favorite way to step away from screens and create something with my hands. I love combining ingredients, testing flavors, and serving good meals to friends. It's my space for experimenting and unwinding.
						</p>

						<div id="cooking-placeholder" className="text-right">
							<span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/40 cursor-not-allowed">
								<span>Culinary recipes gallery coming soon</span>
								<div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
							</span>
						</div>
					</motion.div>
				</div>

				{/* The Persona Summary */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.4 }}
					viewport={{ once: true }}
					className="mt-20 text-center"
				>
					<div className="inline-block relative">
						<div className="absolute -inset-1 bg-gradient-to-r from-transparent via-accent/20 to-transparent blur-md" />
						<p className="relative text-lg md:text-xl text-white/80 font-light italic max-w-3xl mx-auto leading-relaxed">
							"I am{" "}
							<span className="text-gold-gradient font-bold not-italic">
								Oluwaleke Abiodun
							</span>
							. A software founder, a writer, and a cooking enthusiast. I build things with passion, aiming to create digital products that are helpful, beautiful, and built to last."
						</p>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
