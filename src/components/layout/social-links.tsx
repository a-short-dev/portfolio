"use client";

import Link from "next/link";
import React from "react";
import { FaGithub, FaLinkedinIn, FaXTwitter, FaWhatsapp } from "react-icons/fa6";
import { SiSubstack } from "react-icons/si";
import { SOCIAL_LINKS } from "@/lib/constants";

interface SocialLinksProps {
	className?: string;
	iconSize?: number;
}

export default function SocialLinks({ className = "", iconSize = 20 }: SocialLinksProps) {
	const links = [
		{ name: "GitHub", href: SOCIAL_LINKS.github, icon: <FaGithub size={iconSize} /> },
		{ name: "LinkedIn", href: SOCIAL_LINKS.linkedin, icon: <FaLinkedinIn size={iconSize} /> },
		{ name: "Twitter/X", href: SOCIAL_LINKS.twitter, icon: <FaXTwitter size={iconSize} /> },
		{ name: "Substack", href: SOCIAL_LINKS.substack, icon: <SiSubstack size={iconSize} /> },
		{ name: "WhatsApp", href: SOCIAL_LINKS.whatsapp, icon: <FaWhatsapp size={iconSize} /> },
	];

	return (
		<div className={`flex items-center gap-4 ${className}`}>
			{links.map((link) => (
				<Link
					key={link.name}
					href={link.href}
					target="_blank"
					rel="noopener noreferrer"
					className="p-3.5 rounded-full border border-white/5 hover:border-accent text-white/30 hover:text-accent transition-all duration-300 hover:scale-110 bg-white/[0.02] flex items-center justify-center"
					aria-label={`Visit Oluwaleke on ${link.name}`}
				>
					{link.icon}
				</Link>
			))}
		</div>
	);
}
