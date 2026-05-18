"use client";

import { motion } from "framer-motion";
import { Disc } from "lucide-react";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
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
		try {
			const res = await fetch("/api/spotify/current");
			if (!res.ok) return;

			const data = await res.json();
			if (data.isPlaying && data.title) {
				setCurrentTrack({
					name: data.title,
					artist: data.artist,
					album: data.album,
					image: data.albumImageUrl,
					url: data.songUrl,
					isPlaying: data.isPlaying,
					progress: data.progressMs || 0,
					duration: data.durationMs || 0,
				});
			} else {
				// Fallback to "OFFLINE" state if nothing playing
				setCurrentTrack(null);
			}
		} catch (error) {
			console.error("Failed to fetch Spotify status", error);
		}
	}, []);

	useEffect(() => {
		fetchSpotifyData();
		const interval = setInterval(fetchSpotifyData, 10000);
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
			<div
				role="button"
				tabIndex={0}
				className={cn(
					"bg-black border border-white/10 transition-all duration-500 cursor-pointer shadow-2xl text-left outline-none group overflow-hidden relative",
					isExpanded
						? "w-80 rounded-sm p-6 border-[#1DB954]/20 shadow-[0_0_30px_rgba(0,0,0,0.8)]"
						: "w-14 h-14 rounded-full flex items-center justify-center hover:border-[#1DB954] hover:scale-105",
				)}
				onClick={() => setIsExpanded(!isExpanded)}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						setIsExpanded(!isExpanded);
					}
				}}
			>
				{/* Alive Visualizer Background (Subtle) */}
				{isExpanded && (
					<div className="absolute bottom-0 right-0 left-0 h-16 flex items-end justify-between px-6 opacity-20 pointer-events-none">
						{bars.map((bar) => (
							<motion.div
								key={bar}
								className="w-1 bg-[#1DB954]"
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
						<Disc className="w-6 h-6 text-white group-hover:text-[#1DB954] animate-spin-slow transition-colors" />
						<span className="absolute -top-1 -right-1 w-2 h-2 bg-[#1DB954] rounded-full animate-pulse shadow-[0_0_5px_rgba(29,185,84,0.8)]" />
					</div>
				) : (
					<div
						className="space-y-6 relative z-10 cursor-default"
						onClick={(e) => e.stopPropagation()}
						onKeyDown={(e) => e.stopPropagation()}
						role="presentation"
					>
						{/* Header HUD */}
						{currentTrack && (
							<div className="space-y-5">
								<div className="flex items-center justify-between border-b border-white/5 pb-4">
									<div className="flex items-center gap-2">
										<motion.div
											className="w-1.5 h-1.5 bg-[#1DB954] rounded-full"
											animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
											transition={{ duration: 2, repeat: Infinity }}
										/>
										<span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#1DB954]">
											Live_Signal
										</span>
									</div>
									<span className="text-[8px] font-mono text-white/20">
										CH_01
									</span>
								</div>

								<div className="flex items-center gap-4">
									{/* Album Artwork with Spotify Guidelines (4px rounded corners) */}
									<div className="relative w-12 h-12 flex-shrink-0">
										<div className="absolute inset-0 bg-[#1DB954]/20 rounded blur-md animate-pulse-slow" />
										{currentTrack.image ? (
											<Image
												src={currentTrack.image}
												alt={`${currentTrack.album} cover`}
												width={48}
												height={48}
												className="rounded-[4px] relative z-10 object-cover"
												unoptimized
											/>
										) : (
											<Disc className="w-12 h-12 text-white/90 animate-spin-slow relative z-10" />
										)}
									</div>

									<div className="flex-1 min-w-0 font-mono">
										<a
											href={currentTrack.url}
											target="_blank"
											rel="noopener noreferrer"
											className="text-sm font-bold text-white truncate uppercase tracking-wider hover:text-[#1DB954] transition-colors block"
										>
											{currentTrack.name}
										</a>
										<p className="text-[10px] text-[#1DB954]/80 truncate uppercase mt-0.5 font-bold">
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
											className="bg-[#1DB954] h-full shadow-[0_0_10px_rgba(29,185,84,0.8)]"
										/>
									</div>
									<div className="flex justify-between text-[8px] font-mono text-white/30">
										<span>{formatTime(currentTrack.progress)}</span>
										<span>{formatTime(currentTrack.duration)}</span>
									</div>
								</div>

								{/* Now Playing Indicator */}
								<div className="flex items-center justify-center pt-2">
									<div className="flex items-center gap-2">
										{currentTrack.isPlaying ? (
											<>
												<div className="flex gap-1">
													<div className="w-0.5 h-3 bg-[#1DB954] animate-[playing_1s_ease-in-out_infinite]" />
													<div className="w-0.5 h-3 bg-[#1DB954] animate-[playing_1s_ease-in-out_0.2s_infinite]" />
													<div className="w-0.5 h-3 bg-[#1DB954] animate-[playing_1s_ease-in-out_0.4s_infinite]" />
												</div>
												<span className="text-[9px] font-mono text-[#1DB954]/60 uppercase tracking-wider">
													Now Playing
												</span>
											</>
										) : (
											<span className="text-[9px] font-mono text-white/30 uppercase tracking-wider">
												Paused
											</span>
										)}
									</div>
								</div>
							</div>
						)}

						<div className="border-t border-white/5 pt-2 text-center">
							<button
								type="button"
								className="text-[8px] uppercase tracking-widest text-white/20 hover:text-red-500 transition-colors"
								onClick={(e) => {
									e.stopPropagation();
									setIsExpanded(false);
								}}
							>
								[TERMINATE_LINK]
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default SpotifyWidget;
