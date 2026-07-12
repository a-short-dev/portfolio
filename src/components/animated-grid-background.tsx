"use client";

import type React from "react";
import { useEffect, useRef } from "react";

interface AnimatedGridBackgroundProps {
	className?: string;
}

const AnimatedGridBackground: React.FC<AnimatedGridBackgroundProps> = ({
	className = "",
}) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		let animationFrameId: number;
		let width = 0;
		let height = 0;

		const dots: Array<{
			x: number;
			y: number;
			baseX: number;
			baseY: number;
			size: number;
			opacity: number;
			isHighlight: boolean;
			angle: number;
			speed: number;
		}> = [];

		const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		let resizeTimeout: NodeJS.Timeout;

		const handleResize = () => {
			if (typeof window === "undefined") return;
			clearTimeout(resizeTimeout);
			resizeTimeout = setTimeout(() => {
				width = window.innerWidth;
				height = window.innerHeight;

				// Viewport-aware grid density reduction
				const isMobile = width < 640;
				const currentRows = isMobile ? 12 : 25;
				const currentCols = isMobile ? 20 : 40;

				canvas.width = width * window.devicePixelRatio;
				canvas.height = height * window.devicePixelRatio;
				ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

				initDots(currentRows, currentCols);

				if (prefersReducedMotion) {
					drawFrame();
				}
			}, 150);
		};

		const initDots = (targetRows: number, targetCols: number) => {
			dots.length = 0;
			for (let i = 0; i < targetRows; i++) {
				for (let j = 0; j < targetCols; j++) {
					const baseX = (j / (targetCols - 1)) * width;
					const baseY = (i / (targetRows - 1)) * height;
					dots.push({
						x: baseX,
						y: baseY,
						baseX,
						baseY,
						size: Math.random() * 1.5 + 0.5,
						opacity: Math.random() * 0.4 + 0.1,
						isHighlight: Math.random() > 0.95,
						angle: Math.random() * Math.PI * 2,
						speed: 0.02 + Math.random() * 0.03,
					});
				}
			}
		};

		const drawFrame = () => {
			ctx.clearRect(0, 0, width, height);
			dots.forEach((dot) => {
				ctx.beginPath();
				ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);

				if (dot.isHighlight) {
					ctx.fillStyle = `rgba(184, 134, 11, ${dot.opacity + 0.3})`;
					ctx.shadowBlur = 10;
					ctx.shadowColor = "rgba(184, 134, 11, 0.4)";
				} else {
					ctx.fillStyle = `rgba(100, 116, 139, ${dot.opacity})`;
					ctx.shadowBlur = 0;
					ctx.shadowColor = "transparent";
				}

				ctx.fill();
			});
		};

		const render = () => {
			dots.forEach((dot) => {
				dot.angle += dot.speed;
				dot.x = dot.baseX + Math.cos(dot.angle) * 10;
				dot.y = dot.baseY + Math.sin(dot.angle) * 8;
			});

			drawFrame();

			if (!prefersReducedMotion) {
				animationFrameId = requestAnimationFrame(render);
			}
		};

		window.addEventListener("resize", handleResize);
		handleResize();

		if (!prefersReducedMotion) {
			render();
		}

		return () => {
			window.removeEventListener("resize", handleResize);
			clearTimeout(resizeTimeout);
			cancelAnimationFrame(animationFrameId);
		};
	}, []);

	return (
		<div
			className={`fixed inset-0 pointer-events-none overflow-hidden -z-10 ${className}`}
		>
			<canvas
				ref={canvasRef}
				className="w-full h-full"
				style={{ filter: "blur(0.5px)" }}
			/>
			{/* Subtle overlays for professional GoT depth */}
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(15,15,16,0.4)_100%)]" />
			<div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-transparent to-slate-950/40" />
		</div>
	);
};

export default AnimatedGridBackground;
