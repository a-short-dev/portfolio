"use client";

import type React from "react";
import { FaWhatsapp } from "react-icons/fa";
import type { Message } from "./types";

interface ChatMessageListProps {
	messages: Message[];
	isLoading: boolean;
	onWhatsAppTransfer: () => void;
	onSuggestedQuestion: (question: string) => void;
	chatContainerRef: React.RefObject<HTMLDivElement | null>;
	messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

const suggestedQuestions = [
	"Technical mastery?",
	"Architectural history?",
	"Deployment strategy?",
	"System availability?",
];

export default function ChatMessageList({
	messages,
	isLoading,
	onWhatsAppTransfer,
	onSuggestedQuestion,
	chatContainerRef,
	messagesEndRef,
}: ChatMessageListProps) {
	return (
		<div
			ref={chatContainerRef}
			className="flex-1 overflow-y-auto p-4 space-y-4 bg-black text-sm scrollbar-thin scrollbar-thumb-white/20 overscroll-contain"
			style={{
				scrollBehavior: "smooth",
				WebkitOverflowScrolling: "touch",
			}}
		>
			{messages.map((message) => {
				if (!message.isUser && message.content === "" && message.isStreaming) {
					return null;
				}
				return (
					<div
						key={message.id}
						className={`flex flex-col ${message.isUser ? "items-end" : "items-start"}`}
					>
						<span className="text-[10px] text-[#E2B53E]/80 mb-1.5 uppercase tracking-wider font-bold">
							{message.isUser ? "You" : "System"}
						</span>
						<div
							className={`max-w-[85%] p-3.5 border ${
								message.isUser
									? "bg-[#E2B53E] text-black border-[#E2B53E] font-medium"
									: "bg-white/[0.05] text-white border-white/10"
							}`}
						>
							<p className="leading-relaxed text-sm">
								{message.content}
								{message.isStreaming && (
									<span className="inline-block w-1.5 h-3.5 bg-[#E2B53E] ml-1.5 animate-pulse" />
								)}
							</p>
						</div>

						{/* WhatsApp Direct Option */}
						{!message.isUser &&
							message.hasWhatsAppOption &&
							!message.isStreaming && (
								<div className="mt-2">
									<button
										type="button"
										onClick={onWhatsAppTransfer}
										className="flex items-center gap-2 px-3 py-1.5 bg-[#E2B53E]/20 hover:bg-[#E2B53E] text-[#E2B53E] hover:text-black text-[9px] uppercase font-bold tracking-widest border border-[#E2B53E]/45 transition-all duration-300 rounded cursor-pointer"
									>
										<FaWhatsapp size={10} />
										<span>Secure_Link</span>
									</button>
								</div>
							)}
					</div>
				);
			})}

			{/* Fluid bouncing dots loading animation */}
			{isLoading && messages[messages.length - 1]?.content === "" && (
				<div className="flex flex-col items-start animate-fade-in">
					<span className="text-[10px] text-[#E2B53E]/80 mb-1.5 uppercase tracking-wider font-bold">
						System
					</span>
					<div className="flex items-center gap-1.5 px-4 py-3 bg-white/[0.05] border border-white/10 rounded max-w-[60px]">
						<span className="w-1.5 h-1.5 bg-[#E2B53E] rounded-full animate-bounce [animation-delay:-0.3s]" />
						<span className="w-1.5 h-1.5 bg-[#E2B53E] rounded-full animate-bounce [animation-delay:-0.15s]" />
						<span className="w-1.5 h-1.5 bg-[#E2B53E] rounded-full animate-bounce" />
					</div>
				</div>
			)}

			{messages.length === 1 && !isLoading && (
				<div className="flex flex-col gap-2.5 mt-2 border border-[#E2B53E]/20 bg-[#E2B53E]/[0.04] p-3.5 rounded">
					<span className="text-[10px] uppercase tracking-widest text-[#E2B53E] font-bold block mb-1">
						Suggested Inquiries:
					</span>
					<div className="grid grid-cols-2 gap-2">
						{suggestedQuestions.map((q) => (
							<button
								key={q}
								type="button"
								onClick={() => onSuggestedQuestion(q)}
								className="text-left text-xs p-2.5 border border-[#E2B53E]/45 hover:border-[#E2B53E] bg-[#E2B53E]/10 hover:bg-[#E2B53E] text-[#E2B53E] hover:text-black transition-all duration-300 rounded cursor-pointer"
							>
								{q}
							</button>
						))}
					</div>
				</div>
			)}
			<div ref={messagesEndRef} />
		</div>
	);
}
