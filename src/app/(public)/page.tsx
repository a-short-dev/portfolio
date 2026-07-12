// Server Component — no "use client" directive

import { headers } from "next/headers";
import { Projects } from "@/data/projects";
import HomeClient from "./home-client";
import { DOMAINS, OWNER_INFO, SOCIAL_LINKS } from "@/lib/constants";

// ── JSON-LD schemas ───────────────────────────────────────────────────────────

const personSchema = {
	"@context": "https://schema.org",
	"@type": "Person",
	name: OWNER_INFO.name,
	alternateName: OWNER_INFO.shortName,
	jobTitle: OWNER_INFO.title,
	description:
		"Polyglot software engineer and founder building high-performance systems and bootstrapping products.",
	url: DOMAINS.canonical,
	image: `${DOMAINS.canonical}/og-image.png`,
	sameAs: [
		SOCIAL_LINKS.twitter,
		SOCIAL_LINKS.github,
		SOCIAL_LINKS.substack,
		SOCIAL_LINKS.linkedin,
	],
	knowsAbout: [
		"React",
		"Next.js",
		"React Native",
		"TypeScript",
		"Node.js",
		"Python",
		"PostgreSQL",
		"Rust",
		"Swift",
		"Kotlin",
		"Mobile App Development",
		"Web Development",
		"API Development",
	],
	worksFor: {
		"@type": "Organization",
		name: OWNER_INFO.brand,
	},
};

const websiteSchema = {
	"@context": "https://schema.org",
	"@type": "WebSite",
	name: `${OWNER_INFO.name} Portfolio`,
	url: DOMAINS.canonical,
	description: `Portfolio of ${OWNER_INFO.name} — ${OWNER_INFO.title}`,
	author: {
		"@type": "Person",
		name: OWNER_INFO.name,
	},
	potentialAction: {
		"@type": "SearchAction",
		target: {
			"@type": "EntryPoint",
			urlTemplate: `${DOMAINS.canonical}/?q={search_term_string}`,
		},
		"query-input": "required name=search_term_string",
	},
};

const profilePageSchema = {
	"@context": "https://schema.org",
	"@type": "ProfilePage",
	dateCreated: "2024-01-01T00:00:00Z",
	dateModified: "2026-07-12T00:00:00Z",
	mainEntity: {
		"@type": "Person",
		name: OWNER_INFO.name,
		alternateName: OWNER_INFO.shortName,
		identifier: OWNER_INFO.brand,
		description:
			"Polyglot software engineer specializing in Kotlin, Swift, Rust, and TypeScript.",
		image: `${DOMAINS.canonical}/og-image.png`,
		sameAs: [
			SOCIAL_LINKS.github,
			SOCIAL_LINKS.twitter,
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

export default async function HomePage() {
	const headersList = await headers();
	const nonce = headersList.get("x-nonce") || undefined;

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

	// biome-ignore-start lint/security/noDangerouslySetInnerHtml: JSON-LD is safely sanitized via toJsonLd
	return (
		<>
			{/* ── Structured Data (server-rendered, immediately crawlable) ──────── */}
			<script
				type="application/ld+json"
				nonce={nonce}
				dangerouslySetInnerHTML={{ __html: toJsonLd(personSchema) }}
			/>
			<script
				type="application/ld+json"
				nonce={nonce}
				dangerouslySetInnerHTML={{ __html: toJsonLd(websiteSchema) }}
			/>
			<script
				type="application/ld+json"
				nonce={nonce}
				dangerouslySetInnerHTML={{ __html: toJsonLd(profilePageSchema) }}
			/>
			{projectSchemas.map((schema) => (
				<script
					key={`project-ld-${schema.name}`}
					type="application/ld+json"
					nonce={nonce}
					dangerouslySetInnerHTML={{ __html: toJsonLd(schema) }}
				/>
			))}

			{/* ── Interactive shell (client component handles GSAP) ────────────── */}
			<HomeClient />
		</>
	);
	// biome-ignore-end lint/security/noDangerouslySetInnerHtml: JSON-LD is safely sanitized via toJsonLd
}
