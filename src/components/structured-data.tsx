"use client";

import { useEffect } from "react";

interface StructuredDataProps {
	projects?: Array<{
		title: string;
		description: string;
		url: string;
		techStack: string[];
	}>;
}

export default function StructuredData({ projects = [] }: StructuredDataProps) {
	useEffect(() => {
		// Person Schema
		const personSchema = {
			"@context": "https://schema.org",
			"@type": "Person",
			name: "Oluwaleke Abiodun",
			alternateName: "Leke",
			jobTitle: "Full Stack Software Engineer",
			description:
				"Polyglot software engineer specializing in React, Next.js, React Native, Node.js, and Python.",
			url: "https://oluwaleke.dev",
			image: "https://oluwaleke.dev/og-image.png",
			sameAs: [
				"https://twitter.com/a_short_dev",
				"https://instagram.com/a-short-dev",
				"https://github.com/a-short-dev",
				"https://devweaver.substack.com",
			],
			knowsAbout: [
				"React",
				"Next.js",
				"React Native",
				"TypeScript",
				"Node.js",
				"Python",
				"PostgreSQL",
				"Prisma",
				"NestJS",
				"Mobile App Development",
				"Web Development",
				"API Development",
			],
			worksFor: {
				"@type": "Organization",
				name: "Freelance",
			},
		};

		// WebSite Schema
		const websiteSchema = {
			"@context": "https://schema.org",
			"@type": "WebSite",
			name: "Oluwaleke Abiodun Portfolio",
			url: "https://oluwaleke.dev",
			author: {
				"@type": "Person",
				name: "Oluwaleke Abiodun",
			},
			description:
				"Portfolio of Oluwaleke Abiodun - Full Stack Software Engineer",
		};

		// Project schemas
		const projectSchemas = projects.map((project) => ({
			"@context": "https://schema.org",
			"@type": "SoftwareApplication",
			name: project.title,
			description: project.description,
			url: project.url,
			applicationCategory: "WebApplication",
			author: {
				"@type": "Person",
				name: "Oluwaleke Abiodun",
			},
			keywords: project.techStack.join(", "),
		}));

		// Inject schemas
		const schemas = [personSchema, websiteSchema, ...projectSchemas];
		schemas.forEach((schema, index) => {
			const existingScript = document.getElementById(
				`structured-data-${index}`,
			);
			if (existingScript) {
				existingScript.remove();
			}
			const script = document.createElement("script");
			script.id = `structured-data-${index}`;
			script.type = "application/ld+json";
			script.textContent = JSON.stringify(schema);
			document.head.appendChild(script);
		});

		return () => {
			schemas.forEach((_, index) => {
				const script = document.getElementById(`structured-data-${index}`);
				if (script) script.remove();
			});
		};
	}, [projects]);

	return null;
}
