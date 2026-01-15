"use client";

import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Cpu, Send, Terminal, Activity, Github } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
	id: string;
	content: string;
	isUser: boolean;
	timestamp: Date;
}

export default function TheNexusCore() {
	const [messages, setMessages] = useState<Message[]>([
		{
			id: "1",
			content:
				"System Interface initialized. I am the architectural log for Oluwaleke Abiodun. Query for skills, deployment history, or contact protocols.",
			isUser: false,
			timestamp: new Date(),
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
		setInputMessage("");
		setIsLoading(true);

		try {
			const response = await fetch("/api/chat", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ message: inputMessage }),
			});

			if (!response.ok) {
				throw new Error("Failed to get response");
			}

			const data = await response.json();

			const aiMessage: Message = {
				id: (Date.now() + 1).toString(),
				content: data.response,
				isUser: false,
				timestamp: new Date(),
			};

			setMessages((prev) => [...prev, aiMessage]);
		} catch (error) {
			console.error("Error:", error);
			const errorMessage: Message = {
				id: (Date.now() + 1).toString(),
				content:
					"Connection lost. Manual protocol required. Contact via direct link below.",
				isUser: false,
				timestamp: new Date(),
			};
			setMessages((prev) => [...prev, errorMessage]);
		} finally {
			setIsLoading(false);
			inputRef.current?.focus();
		}
	};

	const suggestedQuestions = [
		"Technical stack?",
		"Project history?",
		"Contact info?",
		"Availability?",
	];

	const handleSuggestedQuestion = (question: string) => {
		setInputMessage(question);
		inputRef.current?.focus();
	};

	return (
		<section className="w-full py-32 px-4 relative bg-black">
			{/* Subtle Grid */}
			<div
				className="absolute inset-0 opacity-[0.05]"
				style={{
					backgroundImage:
						"linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
					backgroundSize: "40px 40px",
				}}
			/>

			<div className="max-w-3xl mx-auto relative z-10">
				<div className="text-center mb-12">
					<div className="inline-flex items-center gap-2 py-1 px-3 mb-6 border border-white/20 bg-white/5 font-mono text-[10px] uppercase tracking-widest text-white/60">
						<Terminal size={10} />
						TERMINAL_V1.0
					</div>
					<h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter text-white">
						SYSTEM INTERFACE
					</h2>
					<p className="text-sm font-mono text-white/40 uppercase tracking-widest">
						Direct Line to Architecture Logic
					</p>
				</div>

				{/* Terminal Container */}
				<div className="relative border-x border-t border-white/10 bg-black shadow-2xl">
					{/* Terminal Header */}
					<div className="bg-white/5 border-b border-white/10 p-3 flex items-center justify-between">
						<div className="flex gap-2">
							<div className="w-3 h-3 rounded-full bg-white/20" />
							<div className="w-3 h-3 rounded-full bg-white/20" />
							<div className="w-3 h-3 rounded-full bg-white/20" />
						</div>
						<div className="font-mono text-[10px] text-white/40 uppercase tracking-widest">
							bash - root@oluwaleke
						</div>
						<div />
					</div>

					{/* Messages Display */}
					<div className="h-[400px] overflow-y-auto p-6 space-y-6 font-mono text-sm scrollbar-thin scrollbar-thumb-white/20">
						<AnimatePresence initial={false}>
							{messages.map((message) => (
								<motion.div
									key={message.id}
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									className={`flex flex-col gap-1 ${message.isUser ? "items-end" : "items-start"}`}
								>
									<span className="text-[10px] text-white/20 uppercase tracking-wider">
										{message.isUser ? "USER" : "SYSTEM"}
									</span>
									<div
										className={`max-w-[85%] p-3 border ${
											message.isUser
												? "border-white bg-white text-black"
												: "border-white/10 bg-white/5 text-white/80"
										}`}
									>
										{message.content}
									</div>
								</motion.div>
							))}
						</AnimatePresence>

						{isLoading && (
							<div className="flex gap-2 items-center text-white/40 text-xs uppercase tracking-widest animate-pulse">
								<Activity size={12} />
								<span>Processing Query...</span>
							</div>
						)}
						<div ref={messagesEndRef} />
					</div>

					{/* Input Area */}
					<div className="p-4 border-t border-white/10 bg-white/5">
						<form onSubmit={handleSubmit} className="flex gap-4">
							<span className="text-white/40 font-mono py-3 font-bold">
								{">"}
							</span>
							<input
								ref={inputRef}
								type="text"
								value={inputMessage}
								onChange={(e) => setInputMessage(e.target.value)}
								placeholder="Input command..."
								className="flex-1 bg-transparent border-none text-white font-mono placeholder:text-white/20 focus:outline-none focus:ring-0"
								disabled={isLoading}
							/>
							<button
								type="submit"
								disabled={!inputMessage.trim() || isLoading}
								className="text-white/40 hover:text-white transition-colors disabled:opacity-20"
							>
								<Send size={16} />
							</button>
						</form>
					</div>
				</div>

				{/* Quick Commands (Outside Terminal) */}
				<div className="mt-4 flex flex-wrap justify-center gap-3">
					{suggestedQuestions.map((question) => (
						<button
							key={question}
							type="button"
							onClick={() => handleSuggestedQuestion(question)}
							className="text-[10px] font-mono uppercase tracking-widest text-white/40 hover:text-white hover:underline transition-all"
						>
							[{question}]
						</button>
					))}
				</div>
			</div>
		</section>
	);
}
