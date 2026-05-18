// Server Component — no "use client" directive

import { Projects } from "@/data/projects";
import HomeClient from "./home-client";

// ── JSON-LD schemas ───────────────────────────────────────────────────────────

const personSchema = {
	"@context": "https://schema.org",
	"@type": "Person",
	name: "Oluwaleke Abiodun",
	alternateName: "Leke",
	jobTitle: "Full Stack Software Engineer",
	description:
		"Polyglot software engineer specializing in React, Next.js, React Native, Node.js, and Python. Building scalable web apps, mobile apps, and backend systems.",
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

const websiteSchema = {
	"@context": "https://schema.org",
	"@type": "WebSite",
	name: "Oluwaleke Abiodun Portfolio",
	url: "https://oluwaleke.dev",
	description: "Portfolio of Oluwaleke Abiodun — Full Stack Software Engineer",
	author: {
		"@type": "Person",
		name: "Oluwaleke Abiodun",
	},
	potentialAction: {
		"@type": "SearchAction",
		target: {
			"@type": "EntryPoint",
			urlTemplate: "https://oluwaleke.dev/?q={search_term_string}",
		},
		"query-input": "required name=search_term_string",
	},
};

const profilePageSchema = {
	"@context": "https://schema.org",
	"@type": "ProfilePage",
	dateCreated: "2024-01-01T00:00:00Z",
	dateModified: new Date().toISOString(),
	mainEntity: {
		"@type": "Person",
		name: "Oluwaleke Abiodun",
		alternateName: "Leke",
		identifier: "a-short-dev",
		description:
			"Polyglot software engineer specializing in React, Next.js, React Native, Node.js, and Python.",
		image: "https://oluwaleke.dev/og-image.png",
		sameAs: [
			"https://github.com/a-short-dev",
			"https://twitter.com/a_short_dev",
		],
	},
};

/**
 * Safely serialise a schema object to a JSON-LD string.
 * Replaces `<` with its unicode escape to prevent XSS via script injection.
 */
function toJsonLd(schema: unknown): string {
	return JSON.stringify(schema).replace(/</g, "\\u003c");
}

// ── Page (Server Component) ───────────────────────────────────────────────────

export default function Home() {
	// Build SoftwareApplication schemas from the static Projects list
	const projectSchemas = Projects.map((project) => ({
		"@context": "https://schema.org",
		"@type": "SoftwareApplication",
		name: project.title,
		description: project.description ?? "",
		url: project.url,
		applicationCategory: "WebApplication",
		author: {
			"@type": "Person",
			name: "Oluwaleke Abiodun",
		},
		keywords: (project.techStack ?? []).join(", "),
	}));

	return (
		<>
			{/* ── Structured Data (server-rendered, immediately crawlable) ──────── */}
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: toJsonLd(personSchema) }}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: toJsonLd(websiteSchema) }}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: toJsonLd(profilePageSchema) }}
			/>
			{projectSchemas.map((schema, i) => (
				<script
					key={`project-ld-${i}`}
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: toJsonLd(schema) }}
				/>
			))}

			{/* ── Interactive shell (client component handles GSAP) ────────────── */}
			<HomeClient />
		</>
	);
}
