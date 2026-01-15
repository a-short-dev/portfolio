"use client";

import { AnimatePresence, motion } from "framer-motion";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Send, Cpu, X, User, Activity, Terminal } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

interface Message {
	id: string;
	content: string;
	isUser: boolean;
	timestamp: Date;
	hasWhatsAppOption?: boolean;
	stats?: {
		model?: string;
		inputTokens?: number;
		outputTokens?: number;
		totalTokens?: number;
		responseTime?: number;
		charactersGenerated?: number;
		wordsGenerated?: number;
		temperature?: number;
		maxTokens?: number;
		requestTime?: string;
		completionTime?: string;
		clientIP?: string;
	};
	isStreaming?: boolean;
}

export default function FloatingChatButton() {
	const [isOpen, setIsOpen] = useState(false);
	const [messages, setMessages] = useState<Message[]>([
		{
			id: "1",
			content:
				"System Interface initialized. How shall we optimize your vision today?",
			isUser: false,
			timestamp: new Date(),
			hasWhatsAppOption: true,
		},
	]);
	const [inputMessage, setInputMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const messagesEndRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const scrollToBottom = useCallback(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, []);

	useEffect(() => {
		if (messages.length >= 0) {
			scrollToBottom();
		}
	}, [messages, scrollToBottom]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!inputMessage.trim() || isLoading) return;

		const userMessage: Message = {
			id: Date.now().toString(),
			content: inputMessage,
			isUser: true,
			timestamp: new Date(),
		};

		setMessages((prev) => [...prev, userMessage]);
		const currentInput = inputMessage;
		setInputMessage("");
		setIsLoading(true);

		const aiMessageId = (Date.now() + 1).toString();
		const initialAiMessage: Message = {
			id: aiMessageId,
			content: "",
			isUser: false,
			timestamp: new Date(),
			hasWhatsAppOption: true,
			isStreaming: true,
			stats: {},
		};

		setMessages((prev) => [...prev, initialAiMessage]);

		try {
			const response = await fetch("/api/chat", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ message: currentInput }),
			});

			if (!response.ok) {
				throw new Error("Failed to get response");
			}

			const reader = response.body?.getReader();
			const decoder = new TextDecoder();
			let buffer = "";

			if (reader) {
				while (true) {
					const { done, value } = await reader.read();
					if (done) break;

					buffer += decoder.decode(value, { stream: true });
					const lines = buffer.split("\n");
					buffer = lines.pop() || "";

					for (const line of lines) {
						if (line.startsWith("data: ")) {
							try {
								const data = JSON.parse(line.slice(6));

								if (data.type === "stats") {
									setMessages((prev) =>
										prev.map((msg) =>
											msg.id === aiMessageId
												? { ...msg, stats: { ...msg.stats, ...data.data } }
												: msg,
										),
									);
								} else if (data.type === "content") {
									setMessages((prev) =>
										prev.map((msg) =>
											msg.id === aiMessageId
												? { ...msg, content: msg.content + data.data.content }
												: msg,
										),
									);
								} else if (data.type === "final_stats") {
									setMessages((prev) =>
										prev.map((msg) =>
											msg.id === aiMessageId
												? {
														...msg,
														stats: { ...msg.stats, ...data.data },
														isStreaming: false,
													}
												: msg,
										),
									);
								} else if (data.type === "error") {
									throw new Error(data.data.message);
								}
							} catch (parseError) {
								console.error("Error parsing SSE data:", parseError);
							}
						}
					}
				}
			}
		} catch (error) {
			console.error("Error:", error);
			setMessages((prev) =>
				prev.map((msg) =>
					msg.id === aiMessageId
						? {
								...msg,
								content: "Connection lost. Manual protocol required.",
								isStreaming: false,
								hasWhatsAppOption: true,
							}
						: msg,
				),
			);
		} finally {
			setIsLoading(false);
			inputRef.current?.focus();
		}
	};

	const handleWhatsAppTransfer = () => {
		const phoneNumber = "+2348123456789";
		const message = encodeURIComponent(
			"Initiating direct secure channel for architectural consultation.",
		);
		const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
		window.open(whatsappUrl, "_blank");
	};

	const suggestedQuestions = [
		"Technical mastery?",
		"Architectural history?",
		"Deployment strategy?",
		"System availability?",
	];

	const handleSuggestedQuestion = (question: string) => {
		setInputMessage(question);
		inputRef.current?.focus();
	};

	return (
		<>
			{/* Floating Chat Button */}
			<motion.div
				className="fixed bottom-6 right-6 z-50"
				initial={{ scale: 0, rotate: -45 }}
				animate={{ scale: 1, rotate: 0 }}
				transition={{ type: "spring", stiffness: 260, damping: 20 }}
			>
				<motion.button
					onClick={() => setIsOpen(!isOpen)}
					className={`relative w-14 h-14 bg-white text-black rounded-full flex items-center justify-center overflow-hidden transition-all duration-300 shadow-[0_10px_30px_rgba(255,255,255,0.15)] hover:bg-white/90 border border-white hover:border-black/50 group`}
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
				>
					<motion.div
						animate={{ rotate: isOpen ? 90 : 0, scale: isOpen ? 0.8 : 1 }}
						transition={{ duration: 0.3 }}
						className="relative z-10"
					>
						{isOpen ? <X size={24} /> : <Terminal size={24} />}
					</motion.div>
				</motion.button>
			</motion.div>

			{/* Chat Window */}
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, scale: 0.95, y: 40, x: 20 }}
						animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
						exit={{ opacity: 0, scale: 0.95, y: 40, x: 20 }}
						transition={{ type: "spring", stiffness: 300, damping: 30 }}
						className="fixed bottom-24 right-6 w-[calc(100vw-3rem)] sm:w-80 max-w-md h-[450px] bg-black border border-white/20 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col font-mono"
					>
						{/* Chat Header */}
						<div className="bg-white text-black p-4 flex items-center justify-between border-b border-white/10">
							<div className="flex items-center gap-2">
								<div className="w-2 h-2 bg-black rounded-full animate-pulse" />
								<span className="text-[10px] font-bold uppercase tracking-widest">
									System_v1.0
								</span>
							</div>
							<Activity size={12} className="text-black/50" />
						</div>

						{/* Messages */}
						<div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black text-xs scrollbar-thin scrollbar-thumb-white/20">
							{messages.map((message) => (
								<div
									key={message.id}
									className={`flex flex-col ${message.isUser ? "items-end" : "items-start"}`}
								>
									<span className="text-[8px] text-white/30 mb-1 uppercase tracking-wider">
										{message.isUser ? "You" : "System"}
									</span>
									<div
										className={`max-w-[85%] p-3 border ${
											message.isUser
												? "bg-white text-black border-white"
												: "bg-white/5 text-white/80 border-white/10"
										}`}
									>
										<p>
											{message.content}
											{message.isStreaming && (
												<span className="inline-block w-1.5 h-3 bg-white ml-1 animate-pulse" />
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
													onClick={handleWhatsAppTransfer}
													className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white text-white hover:text-black text-[8px] uppercase font-bold tracking-widest border border-white/20 transition-all duration-300"
												>
													<FaWhatsapp size={10} />
													<span>Secure_Link</span>
												</button>
											</div>
										)}
								</div>
							))}
							<div ref={messagesEndRef} />
						</div>

						{/* Input Interface */}
						<div className="p-3 border-t border-white/10 bg-white/5">
							<form onSubmit={handleSubmit} className="flex gap-2">
								<input
									ref={inputRef}
									type="text"
									value={inputMessage}
									onChange={(e) => setInputMessage(e.target.value)}
									placeholder="CMD..."
									className="flex-1 bg-transparent border-none text-white text-xs placeholder:text-white/20 focus:outline-none"
									disabled={isLoading}
								/>
								<button
									type="submit"
									disabled={!inputMessage.trim() || isLoading}
									className="text-white hover:text-white/70 disabled:opacity-30"
								>
									<Send size={14} />
								</button>
							</form>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}
