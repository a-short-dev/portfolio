import React from "react";
import Link from "next/link";
import { FaGithub, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";

export default function Footer() {
	return (
		<footer className="relative py-24 text-center overflow-hidden border-t border-accent/10 bg-black">
			<div className="relative z-10 space-y-12 px-4">
				<div className="max-w-3xl mx-auto">
					<h2 className="text-3xl md:text-5xl font-black text-gold-gradient mb-6 tracking-tighter">
						a_short_dev
					</h2>
					<p className="text-lg text-white/50 leading-relaxed max-w-xl mx-auto font-light">
						Architecting high-performance digital realms with strategic
						precision and{" "}
						<span className="text-accent/80 font-medium">
							unwavering standards.
						</span>
					</p>
				</div>

				<div className="flex items-center justify-center gap-6">
					<Link
						href="https://github.com/a-short-dev"
						target="_blank"
						className="p-4 rounded-full border border-white/5 hover:border-accent text-white/30 hover:text-accent transition-all duration-300 hover:scale-110 group bg-white/[0.02]"
					>
						<FaGithub size={20} />
					</Link>

					<Link
						href="https://www.linkedin.com/in/ashortdev/"
						target="_blank"
						className="p-4 rounded-full border border-white/5 hover:border-accent text-white/30 hover:text-accent transition-all duration-300 hover:scale-110 group bg-white/[0.02]"
					>
						<FaLinkedinIn size={20} />
					</Link>

					<Link
						href="https://x.com/a_short_dev"
						target="_blank"
						className="p-4 rounded-full border border-white/5 hover:border-accent text-white/30 hover:text-accent transition-all duration-300 hover:scale-110 group bg-white/[0.02]"
					>
						<FaXTwitter size={20} />
					</Link>
				</div>

				<div className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/20">
					<p>© 2026 Oluwaleke Abiodun • Architect of Digital Realms</p>
					<div className="mt-2 text-accent/30">Built to Endure</div>
				</div>
			</div>
		</footer>
	);
}
