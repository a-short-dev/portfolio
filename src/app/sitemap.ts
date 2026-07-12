import type { MetadataRoute } from "next";
import { DOMAINS } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl = DOMAINS.canonical;
	const buildDate = new Date("2026-07-12T00:00:00Z");

	return [
		{
			url: baseUrl,
			lastModified: buildDate,
			changeFrequency: "weekly",
			priority: 1,
		},
	];
}
