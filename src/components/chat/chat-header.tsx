"use client";

import { Activity, X } from "lucide-react";

interface ChatHeaderProps {
	onClose: () => void;
}

export default function ChatHeader({ onClose }: ChatHeaderProps) {
	return (
		<div className="bg-black text-[#E2B53E] p-4 flex items-center justify-between border-b border-[#E2B53E]/20">
			<div className="flex items-center gap-2">
				<div className="w-2 h-2 bg-[#E2B53E] rounded-full animate-pulse" />
				<span className="text-[10px] font-bold uppercase tracking-widest text-[#E2B53E]">
					Weaver AI
				</span>
			</div>
			<div className="flex items-center gap-3">
				<Activity size={12} className="text-[#E2B53E]/70 animate-pulse" />
				<button
					type="button"
					onClick={onClose}
					className="text-[#E2B53E]/60 hover:text-[#E2B53E] transition-colors p-1 rounded hover:bg-white/5 cursor-pointer"
				>
					<X size={14} />
				</button>
			</div>
		</div>
	);
}
