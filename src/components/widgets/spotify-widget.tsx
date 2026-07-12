"use client";

import { motion } from "framer-motion";
import { Disc } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
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
	const [isChatOpen, setIsChatOpen] = useState(false);
	const [isChatStreaming, setIsChatStreaming] = useState(false);
	const [isMobile, setIsMobile] = useState(false);

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
		const handleChatState = (e: Event) => {
			const customEvent = e as CustomEvent;
			setIsChatOpen(customEvent.detail?.isOpen ?? false);
			if (customEvent.detail?.isOpen) {
				setIsExpanded(false); // Auto collapse when chat opens to avoid covering
			}
		};
		const handleChatStreaming = (e: Event) => {
			const customEvent = e as CustomEvent;
			setIsChatStreaming(customEvent.detail?.isStreaming ?? false);
		};
		const handleResize = () => {
			setIsMobile(window.innerWidth < 640);
		};

		window.addEventListener("chat-state", handleChatState);
		window.addEventListener("chat-streaming", handleChatStreaming);
		window.addEventListener("resize", handleResize);
		handleResize();

		// Fetch initial data once on mount regardless of expansion state
		fetchSpotifyData();

		return () => {
			window.removeEventListener("chat-state", handleChatState);
			window.removeEventListener("chat-streaming", handleChatStreaming);
			window.removeEventListener("resize", handleResize);
		};
	}, [fetchSpotifyData]);

	useEffect(() => {
		// Only poll if expanded AND chat is NOT actively streaming
		if (!isExpanded || isChatStreaming) return;

		const interval = setInterval(fetchSpotifyData, 30000);
		return () => clearInterval(interval);
	}, [fetchSpotifyData, isExpanded, isChatStreaming]);

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

	if (isChatOpen && isMobile) {
		return null;
	}

	if (!isExpanded) {
		return (
			<div className="fixed bottom-6 left-6 z-40">
				<button
					type="button"
					className="bg-black border border-white/10 transition-all duration-500 cursor-pointer shadow-2xl w-14 h-14 rounded-full flex items-center justify-center hover:border-[#1DB954] hover:scale-105 group outline-none animate-fade-in"
					onClick={() => setIsExpanded(true)}
					aria-label="Open Spotify Widget"
				>
					<div className="relative">
						<Disc className="w-6 h-6 text-white group-hover:text-[#1DB954] animate-spin-slow transition-colors" />
						<span className="absolute -top-1 -right-1 w-2 h-2 bg-[#1DB954] rounded-full animate-pulse shadow-[0_0_5px_rgba(29,185,84,0.8)]" />
					</div>
				</button>
			</div>
		);
	}

	return (
		<div className="fixed bottom-6 left-6 z-40 animate-fade-in">
			<style dangerouslySetInnerHTML={{ __html: `
				@keyframes playing-bar-1 { 0%, 100% { height: 10%; } 50% { height: 80%; } }
				@keyframes playing-bar-2 { 0%, 100% { height: 20%; } 50% { height: 95%; } }
				@keyframes playing-bar-3 { 0%, 100% { height: 15%; } 50% { height: 60%; } }
				.animate-bar-1 { animation: playing-bar-1 1s ease-in-out infinite; }
				.animate-bar-2 { animation: playing-bar-2 1.2s ease-in-out infinite; }
				.animate-bar-3 { animation: playing-bar-3 0.8s ease-in-out infinite; }
			`}} />

			<div className="bg-black border border-white/10 transition-all duration-500 shadow-2xl text-left outline-none group overflow-hidden relative w-80 rounded-sm p-6 border-[#1DB954]/20 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
				
				{/* Close Button HUD */}
				<button
					type="button"
					onClick={() => setIsExpanded(false)}
					className="absolute top-4 right-4 z-20 text-white/40 hover:text-red-500 transition-colors cursor-pointer"
					aria-label="Close Spotify Widget"
				>
					<span className="text-xs font-mono font-bold">[✕]</span>
				</button>

				{/* Alive Visualizer Background (Subtle) */}
				<div className="absolute bottom-0 right-0 left-0 h-16 flex items-end justify-between px-6 opacity-20 pointer-events-none">
					{bars.map((bar) => {
						const animClass = bar % 3 === 0 ? "animate-bar-1" : bar % 3 === 1 ? "animate-bar-2" : "animate-bar-3";
						return (
							<div
								key={bar}
								className={`w-1 bg-[#1DB954] ${animClass}`}
								style={{
									animationDelay: `${bar * 0.08}s`,
									height: "20%"
								}}
							/>
						);
					})}
				</div>

				<div className="space-y-6 relative z-10 cursor-default">
					{/* Header HUD */}
					{currentTrack ? (
						<div className="space-y-5">
							<div className="flex items-center justify-between border-b border-white/5 pb-4 pr-6">
								<div className="flex items-center gap-2">
									<div className="w-1.5 h-1.5 bg-[#1DB954] rounded-full animate-pulse" />
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
								<div className="relative w-12 h-12 shrink-0">
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
									<div
										style={{ width: `${progressPercentage}%` }}
										className="bg-[#1DB954] h-full shadow-[0_0_10px_rgba(29,185,84,0.8)] transition-all duration-1000"
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
												<div className="w-0.5 h-3 bg-[#1DB954] animate-bar-1" />
												<div className="w-0.5 h-3 bg-[#1DB954] animate-bar-2" style={{ animationDelay: "0.2s" }} />
												<div className="w-0.5 h-3 bg-[#1DB954] animate-bar-3" style={{ animationDelay: "0.4s" }} />
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
					) : (
						<div className="space-y-5">
							<div className="flex items-center justify-between border-b border-white/5 pb-4 pr-6">
								<div className="flex items-center gap-2">
									<div className="w-1.5 h-1.5 bg-white/20 rounded-full animate-pulse" />
									<span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">
										Offline_Signal
									</span>
								</div>
								<span className="text-[8px] font-mono text-white/20">
									CH_00
								</span>
							</div>

							<div className="flex items-center gap-4 opacity-55">
								<div className="relative w-12 h-12 shrink-0 flex items-center justify-center bg-white/5 rounded-[4px] border border-white/5">
									<Disc className="w-6 h-6 text-white/30" />
								</div>
								<div className="flex-1 min-w-0 font-mono text-left">
									<p className="text-sm font-bold text-white/40 truncate uppercase tracking-wider">
										Not Listening
									</p>
									<p className="text-[10px] text-white/25 truncate uppercase mt-0.5 font-bold">
										Spotify Offline
									</p>
								</div>
							</div>

							<div className="flex items-center justify-center pt-2">
								<span className="text-[9px] font-mono text-white/20 uppercase tracking-wider">
									Signal Lost or Standby
								</span>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default SpotifyWidget;
