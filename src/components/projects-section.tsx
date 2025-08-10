"use client";

import React from "react";
import { motion } from "framer-motion";
import ProjectCard from "./project-card";

export type ProductCardProps = {
  title: string;
  img: string;
  url: string;
  type: "contract" | "personal" | "opensource";
  description?: string;
  techStack?: string[];
  status?: "completed" | "maintenance" | "ongoing";
};

const Projects: ProductCardProps[] = [
  {
    url: "https://freelance-pro-six.vercel.app",
    title: "Freelance Pro",
    description: "Invoice generating and tracking",
    img: "/projects/freelance.png",
    type: "personal",
    techStack: ["NextJS"],
    status: "ongoing",
  },
  {
    url: "https://cona.vercel.app/",
    title: "Cona",
    description: "Demo webiste for nft",
    img: "/projects/cona.png",
    type: "personal",
    techStack: ["NextJS", "Chakra UI"],
  },
  {
    url: "https://www.npmjs.com/package/fintava",
    title: "Fintava SDK Libray",
    description: "Open source library for fintava payment gatewatey.",
    img: "/projects/fintava.png",
    type: "opensource",
  },
  {
    url: "https://20firstyling.vercel.app",
    title: "TwentyFirst Styling",
    description: "E-commerce store for fashion Desgin",
    img: "/projects/twenty.png",
    type: "contract",
    status: "maintenance",
    techStack: ["NextJS", "PostgresDB", "Redis"],
  },
  {
    url: "https://bestrates-frontend.vercel.app",
    title: "BestRates Digitals",
    description: "WebApp for giftcard and crypto trading",
    img: "/projects/best.png",
    type: "contract",
    techStack: ["NextJS", "PostgresDB", "Redis", "NestJS", "Docker"],
    status: "maintenance",
  },
];

interface ProjectsSectionProps {
  projectsRef: React.RefObject<HTMLDivElement>;
}

export default function ProjectsSection({ projectsRef }: ProjectsSectionProps) {
  return (
    <section 
      id='projects'
      ref={projectsRef}
      className='section-reveal py-32 relative overflow-hidden'
    >
      {/* Norse runes */}
      <div className="absolute top-10 left-10 text-6xl text-red-400/10 animate-rune-glow">ᚠ</div>
      <div className="absolute bottom-10 right-10 text-5xl text-orange-400/10 animate-rune-glow">ᚦ</div>
      
      <div className='text-center mb-24 relative'>
        <div className='mb-6'>
          <h2 className='rune-border text-5xl md:text-6xl font-bold mb-6 relative'>
            <span className='runic-text'>Legendary Artifacts</span>
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-orange-500/20 to-yellow-500/20 blur-3xl -z-10 animate-asgard-glow" />
          </h2>
          {/* Epic divider */}
          <div className='flex items-center justify-center gap-4 mb-8'>
            <div className='text-yellow-400 text-xl animate-rune-glow'>⚔️</div>
            <div className='w-32 h-1 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 rounded-full animate-asgard-glow' />
            <div className='text-yellow-400 text-xl animate-rune-glow'>🛡️</div>
          </div>
        </div>
        <p className='text-xl text-amber-300/80 max-w-3xl mx-auto leading-relaxed'>
          <span className='text-amber-200'>Forged in the fires of innovation</span>, these digital weapons have conquered countless challenges across the Nine Realms of development.
        </p>
      </div>
      
      <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 w-full'>
        {Projects.map((project, index) => (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <ProjectCard
              title={project.title}
              img={project.img}
              url={project.url}
              description={project.description}
              type={project.type}
              status={project.status}
              techStack={project.techStack}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export { Projects };