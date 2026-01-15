"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Play, Pause, SkipForward, Volume2, Disc } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SpotifyTrack {
	name: string;
	artist: string;
	album: string;
	image: string;
	url: string;
	isPlaying: boolean;
	progress: number;
	duration: number;
}

const SpotifyWidget = () => {
	const [currentTrack, setCurrentTrack] = useState<SpotifyTrack | null>(null);
	const [isExpanded, setIsExpanded] = useState(false);

	const fetchSpotifyData = useCallback(async () => {
		setCurrentTrack({
			name: "Audio Protocol v1",
			artist: "System Focus",
			album: "Monochrome",
			image: "/projects/fintava.png",
			url: "#",
			isPlaying: true,
			progress: 184000,
			duration: 245000,
		});
	}, []);

	useEffect(() => {
		fetchSpotifyData();
		const interval = setInterval(fetchSpotifyData, 30000);
		return () => clearInterval(interval);
	}, [fetchSpotifyData]);

	const formatTime = (ms: number) => {
		const minutes = Math.floor(ms / 60000);
		const seconds = Math.floor((ms % 60000) / 1000);
		return `${minutes}:${seconds.toString().padStart(2, "0")}`;
	};

	const progressPercentage = currentTrack
		? (currentTrack.progress / currentTrack.duration) * 100
		: 0;

	// Visualizer Bars Generation
	const bars = Array.from({ length: 12 }).map((_, i) => i);

	return (
		<div className="fixed bottom-6 left-6 z-50">
			<button
				type="button"
				className={cn(
					"bg-black border border-white/10 transition-all duration-500 cursor-pointer shadow-2xl text-left outline-none group overflow-hidden relative",
					isExpanded
						? "w-80 rounded-sm p-6 border-accent/20 shadow-[0_0_30px_rgba(0,0,0,0.8)]"
						: "w-14 h-14 rounded-full flex items-center justify-center hover:border-accent hover:scale-105",
				)}
				onClick={() => setIsExpanded(!isExpanded)}
			>
				{/* Alive Visualizer Background (Subtle) */}
				{isExpanded && (
					<div className="absolute bottom-0 right-0 left-0 h-16 flex items-end justify-between px-6 opacity-20 pointer-events-none">
						{bars.map((bar) => (
							<motion.div
								key={bar}
								className="w-1 bg-accent"
								animate={{ height: ["10%", "60%", "30%", "100%", "20%"] }}
								transition={{
									duration: 0.8,
									repeat: Infinity,
									repeatType: "reverse",
									delay: bar * 0.1,
									ease: "easeInOut",
								}}
							/>
						))}
					</div>
				)}

				{!isExpanded ? (
					<div className="relative">
						<Disc className="w-6 h-6 text-white group-hover:text-accent animate-spin-slow transition-colors" />
						<span className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full animate-pulse shadow-[0_0_5px_hsl(var(--accent))]" />
					</div>
				) : (
					<button
						type="button"
						className="space-y-6 relative z-10"
						onClick={(e) => e.stopPropagation()}
						onKeyDown={(e) => {
							if (e.key === "Enter" || e.key === " ") {
								e.stopPropagation();
							}
						}}
					>
						{/* Header HUD */}
						{currentTrack && (
							<div className="space-y-5">
								<div className="flex items-center justify-between border-b border-white/5 pb-4">
									<div className="flex items-center gap-2">
										<motion.div
											className="w-1.5 h-1.5 bg-accent rounded-full"
											animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
											transition={{ duration: 2, repeat: Infinity }}
										/>
										<span className="text-[9px] font-bold uppercase tracking-[0.2em] text-accent">
											Live_Signal
										</span>
									</div>
									<span className="text-[8px] font-mono text-white/20">
										CH_01
									</span>
								</div>

								<div className="flex items-center gap-4">
									{/* Rotating Disc with Glow */}
									<div className="relative w-12 h-12 flex items-center justify-center">
										<div className="absolute inset-0 bg-accent/20 rounded-full blur-md animate-pulse-slow" />
										<Disc className="w-12 h-12 text-white/90 animate-spin-slow relative z-10" />
									</div>

									<div className="flex-1 min-w-0 font-mono">
										<p className="text-sm font-bold text-white truncate uppercase tracking-wider">
											{currentTrack.name}
										</p>
										<p className="text-[10px] text-accent/80 truncate uppercase mt-0.5 font-bold">
											{currentTrack.artist}
										</p>
									</div>
								</div>

								{/* Progress Bar HUD */}
								<div className="space-y-2">
									<div className="w-full bg-white/5 h-[2px] relative overflow-hidden">
										<motion.div
											initial={{ width: 0 }}
											animate={{ width: `${progressPercentage}%` }}
											className="bg-accent h-full shadow-[0_0_10px_hsl(var(--accent))]"
										/>
									</div>
									<div className="flex justify-between text-[8px] font-mono text-white/30">
										<span>{formatTime(currentTrack.progress)}</span>
										<span>{formatTime(currentTrack.duration)}</span>
									</div>
								</div>

								{/* Controls Terminal */}
								<div className="flex items-center justify-center gap-8 pt-2">
									<button
										type="button"
										className="text-white/40 hover:text-accent transition-colors"
									>
										<Volume2 size={14} />
									</button>
									<button
										type="button"
										className="w-10 h-10 border border-white/10 flex items-center justify-center hover:bg-accent hover:text-black hover:border-accent transition-all duration-300"
									>
										{currentTrack.isPlaying ? (
											<Pause size={14} fill="currentColor" />
										) : (
											<Play size={14} fill="currentColor" />
										)}
									</button>
									<button
										type="button"
										className="text-white/40 hover:text-accent transition-colors"
									>
										<SkipForward size={14} />
									</button>
								</div>
							</div>
						)}

						<div className="border-t border-white/5 pt-2 text-center">
							<button
								type="button"
								className="text-[8px] uppercase tracking-widest text-white/20 hover:text-red-500 transition-colors"
								onClick={() => setIsExpanded(false)}
							>
								[TERMINATE_LINK]
							</button>
						</div>
					</button>
				)}
			</button>
		</div>
	);
};

export default SpotifyWidget;
