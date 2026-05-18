// Pure data — no framework dependencies, safe to import from server components.

export type ProductCardProps = {
	title: string;
	img: string;
	url: string;
	type: "contract" | "personal" | "opensource";
	description?: string;
	techStack?: string[];
	status?: "completed" | "maintenance" | "ongoing";
	className?: string; // For bento grid spans
};

export const Projects: ProductCardProps[] = [
	{
		url: "https://useveris.xyz",
		title: "Veris",
		description:
			"Personal startup ecosystem. Architected for scalability and high-availability.",
		img: "/projects/veris.png",
		type: "personal",
		techStack: ["Tanstack Start", "NestJS", "TypeScript", "PostgreSQL", "LLMs"],
		status: "ongoing",
		className: "md:col-span-1 md:row-span-1",
	},
	{
		url: "https://moodjournal.xyz",
		title: "Moodjournal",
		description:
			"Digital well-being platform focusing on privacy and low-latency interaction.",
		img: "/projects/moood-journal.png",
		type: "personal",
		techStack: ["React Native", "TypeScript", "Supabase"],
		status: "ongoing",
		className: "md:col-span-1 md:row-span-1",
	},
	{
		url: "https://novoctplanet.vercel.app/",
		title: "Novoct Planet",
		description:
			"Premium fashion e-commerce platform. Full catalog, cart, and checkout system.",
		img: "/projects/novoct.png",
		type: "contract",
		techStack: ["Next.js", "Prisma", "PostgreSQL", "Tailwind"],
		status: "ongoing",
		className: "md:col-span-1 md:row-span-1",
	},
	{
		url: "https://canwee.vercel.app/",
		title: "Canwee Apartments",
		description:
			"Luxury short-let property management and booking platform for Nigeria.",
		img: "/projects/canwee-apartments.png",
		type: "contract",
		techStack: ["Next.js", "Prisma", "PostgreSQL", "Tailwind"],
		status: "ongoing",
		className: "md:col-span-1 md:row-span-1",
	},
	{
		url: "https://flexiti.vercel.app/",
		title: "Flexiti",
		description:
			"Licensed consumer finance platform offering personal and business loans in Lagos.",
		img: "/projects/flexiti.png",
		type: "contract",
		techStack: ["Next.js", "Prisma", "PostgreSQL", "Tailwind"],
		status: "ongoing",
		className: "md:col-span-1 md:row-span-1",
	},
	{
		url: "https://uvo.vercel.app/",
		title: "UVO",
		description:
			"Digital billboard advertising platform with client dashboard and booking system.",
		img: "/projects/uvo.png",
		type: "contract",
		techStack: ["Next.js", "Prisma", "PostgreSQL", "Tailwind"],
		status: "ongoing",
		className: "md:col-span-1 md:row-span-1",
	},
	{
		url: "https://ubycohub.com/",
		title: "Ubycohub",
		description:
			"High-conversion landing architecture for a tech hub ecosystem.",
		img: "/projects/ubycohub.png",
		type: "contract",
		status: "completed",
		techStack: ["React", "Tailwind", "Framer Motion"],
		className: "md:col-span-1 md:row-span-1",
	},
	{
		url: "#",
		title: "Oyo State Crime Alert",
		description:
			"Mission-critical backend and management dashboard for state security.",
		img: "/projects/oyo-crime.png",
		type: "contract",
		techStack: ["PHP", "Laravel", "MySQL", "React"],
		status: "completed",
		className: "md:col-span-1 md:row-span-1 lg:col-span-2",
	},
	{
		url: "#",
		title: "NCC Tracking System",
		description:
			"Live phone number lookup and tracking infrastructure. Optimized for speed and data throughput.",
		img: "/projects/ncc-track.png",
		type: "contract",
		techStack: ["Python", "Real-time Processing", "Big Data"],
		status: "completed",
		className: "md:col-span-1 md:row-span-1 lg:col-span-1",
	},
	{
		url: "https://magic-mediatv.vercel.app/",
		title: "Magic MediaTV",
		description:
			"Film and media production company portfolio with dynamic content showcase.",
		img: "/projects/placeholder.png",
		type: "contract",
		techStack: ["Next.js", "Tailwind", "Framer Motion"],
		status: "completed",
		className: "md:col-span-1 md:row-span-1",
	},
	{
		url: "https://vibe-beige-one.vercel.app/",
		title: "Vibe Protocol",
		description:
			"Premium marketplace for code assets—fullstack apps, workflows, and design systems.",
		img: "/projects/placeholder.png",
		type: "personal",
		techStack: ["Next.js", "Prisma", "PostgreSQL"],
		status: "completed",
		className: "md:col-span-1 md:row-span-1",
	},
	{
		url: "https://www.dessymultipurposecompany.com/",
		title: "Dessy Multipurpose",
		description:
			"Real estate, property development, and agricultural services company website.",
		img: "/projects/placeholder.png",
		type: "contract",
		techStack: ["Next.js", "Tailwind", "TypeScript"],
		status: "completed",
		className: "md:col-span-1 md:row-span-1",
	},
	{
		url: "https://laundry-saas.vercel.app/",
		title: "LaundryPro",
		description:
			"AI-powered SaaS platform for laundry and dry cleaning business management.",
		img: "/projects/placeholder.png",
		type: "personal",
		techStack: ["Next.js", "Prisma", "PostgreSQL", "AI"],
		status: "completed",
		className: "md:col-span-1 md:row-span-1",
	},
	{
		url: "https://joint-item-sharing-app.vercel.app/",
		title: "ShareSpace",
		description:
			"Fair item sharing app for roommates and families with random assignment.",
		img: "/projects/placeholder.png",
		type: "personal",
		techStack: ["Next.js", "Prisma", "PostgreSQL"],
		status: "completed",
		className: "md:col-span-1 md:row-span-1",
	},
];
