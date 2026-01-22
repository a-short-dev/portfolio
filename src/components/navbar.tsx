"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";

export default function Navbar() {
	const [isOpen, setIsOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);

	// Handle scroll effect for glassmorphism intensity
	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 50);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// Lock body scroll when mobile menu is open
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}
	}, [isOpen]);

	const navLinks = [
		{ name: "Projects", href: "#projects" },
		{ name: "Skills", href: "#skills-and-tools" },
		{ name: "Poems", href: "https://devweaver.substack.com", external: true },
		{ name: "Cooking", href: "#about" },
		{ name: "Contact", href: "#contact", cta: true },
	];

	return (
		<>
			<header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-[90vw] md:max-w-fit pointer-events-none md:pointer-events-auto">
				<div
					className={`pointer-events-auto transition-all duration-300 rounded-full px-6 py-3 flex items-center justify-between gap-6 md:gap-8 border ${
						scrolled || isOpen
							? "border-white/10 bg-black/80 backdrop-blur-xl shadow-2xl"
							: "border-white/5 bg-black/40 backdrop-blur-sm"
					}`}
				>
					<Link
						href="/"
						className="group relative flex items-center gap-2 z-50"
						onClick={() => setIsOpen(false)}
					>
						<div className="w-2 h-2 bg-accent rounded-full animate-pulse-slow" />
						<span className="font-mono text-xs font-bold tracking-widest text-gold-gradient uppercase group-hover:brightness-110 transition-all duration-300">
							AS_DEV
						</span>
					</Link>

					<div className="w-[1px] h-4 bg-white/10 hidden md:block" />

					{/* Desktop Navigation */}
					<nav className="hidden md:flex items-center gap-8">
						{navLinks.map((link) => (
							<Link
								key={link.name}
								href={link.href}
								target={link.external ? "_blank" : undefined}
								className={`text-[10px] uppercase tracking-widest font-bold transition-all duration-300 ${
									link.cta
										? "text-black bg-accent px-3 py-1.5 rounded-sm hover:bg-white"
										: "text-white/60 hover:text-accent"
								}`}
							>
								{link.name}
							</Link>
						))}
					</nav>

					{/* Mobile Menu Toggle */}
					<button
						type="button"
						className="md:hidden text-white hover:text-accent transition-colors z-50 p-1"
						onClick={() => setIsOpen(!isOpen)}
						aria-label="Toggle menu"
					>
						{isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
					</button>
				</div>
			</header>

			{/* Mobile Menu Overlay */}
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.3 }}
						className="fixed inset-0 z-40 bg-black/95 backdrop-blur-3xl pt-32 px-6 md:hidden flex flex-col items-center"
					>
						<div className="flex flex-col items-center gap-8 w-full max-w-sm">
							{navLinks.map((link, i) => (
								<motion.div
									key={link.name}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.1 + i * 0.1 }}
									className="w-full text-center"
								>
									<Link
										href={link.href}
										target={link.external ? "_blank" : undefined}
										onClick={() => setIsOpen(false)}
										className={`block w-full text-2xl font-black uppercase tracking-tighter ${
											link.cta
												? "text-accent mt-4"
												: "text-white/80 hover:text-white"
										}`}
									>
										{link.name}
									</Link>
									{!link.cta && <div className="h-px w-full bg-white/5 mt-8" />}
								</motion.div>
							))}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}
