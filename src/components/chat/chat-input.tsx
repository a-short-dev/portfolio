"use client";

import { Send } from "lucide-react";
import type React from "react";

interface ChatInputProps {
	inputMessage: string;
	setInputMessage: (msg: string) => void;
	isLoading: boolean;
	onSubmit: (e: React.FormEvent) => void;
	inputRef: React.RefObject<HTMLInputElement | null>;
}

export default function ChatInput({
	inputMessage,
	setInputMessage,
	isLoading,
	onSubmit,
	inputRef,
}: ChatInputProps) {
	return (
		<div className="p-3.5 border-t border-[#E2B53E]/20 bg-black">
			<form onSubmit={onSubmit} className="flex gap-2.5 items-center">
				<span className="text-[#E2B53E] text-sm font-bold select-none">$</span>
				<input
					ref={inputRef}
					type="text"
					value={inputMessage}
					onChange={(e) => setInputMessage(e.target.value)}
					placeholder="CMD..."
					className="flex-1 bg-transparent border-none text-white text-sm placeholder:text-zinc-400 focus:outline-none font-mono"
					disabled={isLoading}
				/>
				<button
					type="submit"
					disabled={!inputMessage.trim() || isLoading}
					className="text-[#E2B53E] hover:text-[#E2B53E]/80 disabled:opacity-30 p-1.5 rounded transition-colors cursor-pointer"
				>
					<Send size={14} />
				</button>
			</form>
		</div>
	);
}
