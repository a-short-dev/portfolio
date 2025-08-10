"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type ProductCardProps = {
  title: string;
  img: string;
  url: string;
  type: "contract" | "personal" | "opensource";
  description?: string;
  techStack?: string[];
  status?: "completed" | "maintenance" | "ongoing";
};

const ProjectCard: React.FC<ProductCardProps> = ({
  title,
  img,
  url,
  type,
  description,
  techStack,
  status,
}) => {
  return (
    <Link href={url} target="_blank" rel="noopener noreferrer">
      <div className="group relative overflow-hidden rounded-xl norse-glass asgard-border hover:scale-105 transition-all duration-500 cursor-pointer">
        {/* Epic Norse glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-orange-500/20 to-yellow-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 animate-asgard-glow" />
        
        {/* Kratos-inspired overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 via-transparent to-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Runic border animation */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-500/0 via-red-500/30 to-amber-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-runic-shimmer" style={{ padding: '2px' }}>
          <div className="w-full h-full rounded-xl bg-gradient-to-br from-stone-900/90 to-slate-900/90" />
        </div>
        
        {/* Norse rune decorations */}
        <div className="absolute top-2 left-2 text-yellow-400/30 text-sm animate-rune-glow opacity-0 group-hover:opacity-100 transition-opacity duration-300">ᚠ</div>
        <div className="absolute top-2 right-2 text-orange-400/30 text-sm animate-rune-glow opacity-0 group-hover:opacity-100 transition-opacity duration-500">ᚦ</div>
      
        {/* Image container */}
        <div className="relative h-48 overflow-hidden z-10">
          <Image
            src={img}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:brightness-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-red-900/20 to-transparent" />
          
          {/* Norse embers and sparks */}
          <div className="absolute top-4 left-4 w-1 h-1 bg-orange-400/80 rounded-full animate-mjolnir-strike opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute bottom-6 right-8 w-0.5 h-0.5 bg-yellow-400/80 rounded-full animate-ragnarok-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute top-1/2 left-1/2 w-0.5 h-0.5 bg-red-400/60 rounded-full animate-viking-float opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
          {/* Status badge */}
          {status && (
            <div className={cn(
              "absolute top-4 right-4 px-3 py-1 rounded-lg text-xs font-bold backdrop-blur-sm border-2 animate-rune-glow",
              status === "completed" && "bg-green-600/30 text-green-200 border-green-400/50 shadow-lg shadow-green-500/20",
              status === "ongoing" && "bg-amber-600/30 text-amber-200 border-amber-400/50 shadow-lg shadow-amber-500/20",
              status === "maintenance" && "bg-blue-600/30 text-blue-200 border-blue-400/50 shadow-lg shadow-blue-500/20"
            )}>
              ⚔️ {status}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="relative p-6 space-y-4 z-10">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold runic-text group-hover:animate-runic-shimmer transition-all duration-300">
              {title}
            </h3>
            <span className={cn(
              "px-3 py-1 rounded-lg text-xs font-bold border-2 backdrop-blur-sm",
              type === "personal" && "bg-red-600/30 text-red-200 border-red-400/50 shadow-lg shadow-red-500/20",
              type === "contract" && "bg-orange-600/30 text-orange-200 border-orange-400/50 shadow-lg shadow-orange-500/20",
              type === "opensource" && "bg-yellow-600/30 text-yellow-200 border-yellow-400/50 shadow-lg shadow-yellow-500/20"
            )}>
              🛡️ {type}
            </span>
          </div>
          
          {description && (
            <p className="text-stone-300 text-sm leading-relaxed group-hover:text-amber-200 transition-colors duration-300">
              ⚡ {description}
            </p>
          )}
        
          {/* Tech stack */}
          {techStack && (
            <div className="flex flex-wrap gap-2">
              {techStack.map((tech, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-stone-800/60 text-amber-200 text-xs rounded-lg border border-amber-600/40 group-hover:border-orange-500/60 group-hover:bg-orange-500/20 group-hover:text-orange-200 transition-all duration-300 font-medium animate-rune-glow"
                >
                  ⚒️ {tech}
                </span>
              ))}
            </div>
          )}
          
          {/* Epic battle cry */}
          <div className="flex items-center gap-3 pt-2">
            <div className="text-amber-400 text-sm animate-rune-glow">ᚱᚨᚷᚾᚨᚱᛟᚲ</div>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
            <div className="text-red-400 text-sm animate-mjolnir-strike">⚡</div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;