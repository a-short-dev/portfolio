import React from "react";
import SocialLinks from "./social-links";
import { OWNER_INFO } from "@/lib/constants";

export default function Footer() {
	return (
		<footer className="relative py-24 text-center overflow-hidden border-t border-accent/10 bg-black">
			<div className="relative z-10 space-y-12 px-4">
				<div className="max-w-3xl mx-auto">
					<h2 className="text-3xl md:text-5xl font-black text-gold-gradient mb-6 tracking-tighter">
						{OWNER_INFO.brand}
					</h2>
					<p className="text-lg text-white/50 leading-relaxed max-w-xl mx-auto font-light">
						Architecting high-performance digital realms with strategic
						precision and{" "}
						<span className="text-accent/80 font-medium">
							unwavering standards.
						</span>
					</p>
				</div>

				<div className="flex justify-center">
					<SocialLinks />
				</div>

				<div className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/20">
					<p>© 2026 {OWNER_INFO.name} • Architect of Digital Realms</p>
					<div className="mt-2 text-accent/30">Built to Endure</div>
				</div>
			</div>
		</footer>
	);
}
