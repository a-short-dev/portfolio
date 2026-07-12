import type { MetadataRoute } from "next";
import { DOMAINS } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: ["/api/", "/login", "/dev", "/get-token", "/client"],
			},
			// AI Crawlers - explicitly allow crawling the public parts of sitemap
			{
				userAgent: "GPTBot",
				allow: "/",
				disallow: ["/api/", "/login", "/dev", "/get-token", "/client"],
			},
			{
				userAgent: "ChatGPT-User",
				allow: "/",
				disallow: ["/api/", "/login", "/dev", "/get-token", "/client"],
			},
			{
				userAgent: "Claude-Web",
				allow: "/",
				disallow: ["/api/", "/login", "/dev", "/get-token", "/client"],
			},
			{
				userAgent: "Anthropic-AI",
				allow: "/",
				disallow: ["/api/", "/login", "/dev", "/get-token", "/client"],
			},
			{
				userAgent: "Google-Extended",
				allow: "/",
				disallow: ["/api/", "/login", "/dev", "/get-token", "/client"],
			},
			{
				userAgent: "PerplexityBot",
				allow: "/",
				disallow: ["/api/", "/login", "/dev", "/get-token", "/client"],
			},
		],
		sitemap: `${DOMAINS.canonical}/sitemap.xml`,
	};
}
