"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Terminal, X } from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import ChatHeader from "./chat/chat-header";
import ChatInput from "./chat/chat-input";
import ChatMessageList from "./chat/chat-message-list";
import type { Message } from "./chat/types";
import WhatsAppLeadForm from "./whatsapp-lead-form";

export default function FloatingChatButton() {
	const [isOpen, setIsOpen] = useState(false);
	const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
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
	const chatContainerRef = useRef<HTMLDivElement>(null);

	// Load chat history safely on mount (hydration-safe)
	useEffect(() => {
		const saved = localStorage.getItem("weaver_chat_history");
		if (saved) {
			try {
				const parsed = JSON.parse(saved).map((msg: any) => ({
					...msg,
					timestamp: new Date(msg.timestamp),
				}));
				if (parsed.length > 0) {
					setMessages(parsed);
				}
			} catch (e) {
				console.error("Failed to load chat history:", e);
			}
		}
	}, []);

	// Write updates to localStorage
	useEffect(() => {
		if (messages.length > 1 || (messages.length === 1 && messages[0].id !== "1")) {
			const messagesToSave = messages.map((msg) => ({
				...msg,
				isStreaming: false, // Ensure we don't persist active stream indicators
			}));
			localStorage.setItem("weaver_chat_history", JSON.stringify(messagesToSave));
		}
	}, [messages]);

	const scrollToBottom = useCallback((force = false) => {
		const container = chatContainerRef.current;
		if (!container) return;

		// If the user has scrolled up to read, do not hijack their scroll unless forced
		const isAtBottom =
			container.scrollHeight - container.scrollTop - container.clientHeight < 200;

		if (force || isAtBottom) {
			requestAnimationFrame(() => {
				if (container) {
					container.scrollTop = container.scrollHeight;
				}
			});
		}
	}, []);

	// Scroll on new messages
	useEffect(() => {
		if (messages.length > 0) {
			const lastMessage = messages[messages.length - 1];
			// Force immediate scroll for user messages or if the assistant is actively streaming tokens!
			scrollToBottom(lastMessage.isUser || lastMessage.isStreaming === true);
		}
	}, [messages, scrollToBottom]);

	// Mobile keyboard handling
	useEffect(() => {
		if (!isOpen) return;

		const handleResize = () => {
			// Detect if keyboard is open on mobile (viewport height changed)
			if (inputRef.current && document.activeElement === inputRef.current) {
				// Ensure input stays visible when keyboard opens
				setTimeout(() => {
					inputRef.current?.scrollIntoView({
						behavior: "smooth",
						block: "nearest",
					});
				}, 100);
			}
		};

		const handleFocus = () => {
			// Scroll to bottom when input is focused (keyboard appears)
			setTimeout(() => {
				scrollToBottom(true);
			}, 300); // Delay for keyboard animation
		};

		const inputElement = inputRef.current;
		if (inputElement) {
			inputElement.addEventListener("focus", handleFocus);
		}

		window.addEventListener("resize", handleResize);
		// Listen for visual viewport changes (better for mobile keyboards)
		if (window.visualViewport) {
			window.visualViewport.addEventListener("resize", handleResize);
		}

		return () => {
			if (inputElement) {
				inputElement.removeEventListener("focus", handleFocus);
			}
			window.removeEventListener("resize", handleResize);
			if (window.visualViewport) {
				window.visualViewport.removeEventListener("resize", handleResize);
			}
		};
	}, [isOpen, scrollToBottom]);

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

		// Prepare chat history payload (excluding active local state changes since setMessages is async)
		const chatHistory = messages
			.map((msg) => ({
				role: msg.isUser ? "user" : "assistant",
				content: msg.content,
			}))
			.filter((msg) => msg.content.trim() !== "");

		try {
			const response = await fetch("/api/chat", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					message: currentInput,
					history: chatHistory,
				}),
			});

			if (!response.ok) {
				let errorMessage = "Connection lost. Manual protocol required.";
				try {
					const errorData = await response.json();
					if (errorData?.error) {
						errorMessage = errorData.error;
					}
				} catch {}

				setMessages((prev) =>
					prev.map((msg) =>
						msg.id === aiMessageId
							? {
									...msg,
									content: errorMessage,
									isStreaming: false,
									hasWhatsAppOption: true,
								}
							: msg,
					),
				);
				setIsLoading(false);
				inputRef.current?.focus();
				return;
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
		setIsLeadFormOpen(true);
	};

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
					className={`relative w-14 h-14 bg-black text-[#E2B53E] rounded-full flex items-center justify-center overflow-hidden transition-all duration-300 shadow-[0_10px_30px_rgba(226,181,62,0.15)] hover:bg-[#E2B53E] hover:text-black border border-[#E2B53E]/30 hover:border-[#E2B53E] group`}
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
						className="fixed inset-0 sm:bottom-24 sm:right-6 sm:left-auto sm:top-auto w-full h-[100dvh] sm:h-[450px] md:h-[550px] sm:w-80 md:w-[480px] bg-black border-y sm:border border-[#E2B53E]/20 sm:rounded-2xl shadow-[0_20px_50px_rgba(226,181,62,0.08)] z-50 overflow-hidden flex flex-col font-mono"
					>
						<ChatHeader onClose={() => setIsOpen(false)} />

						<ChatMessageList
							messages={messages}
							isLoading={isLoading}
							onWhatsAppTransfer={handleWhatsAppTransfer}
							onSuggestedQuestion={handleSuggestedQuestion}
							chatContainerRef={chatContainerRef}
							messagesEndRef={messagesEndRef}
						/>

						<ChatInput
							inputMessage={inputMessage}
							setInputMessage={setInputMessage}
							isLoading={isLoading}
							onSubmit={handleSubmit}
							inputRef={inputRef}
						/>
					</motion.div>
				)}
			</AnimatePresence>

			{/* WhatsApp Lead Form Modal */}
			<WhatsAppLeadForm
				isOpen={isLeadFormOpen}
				onClose={() => setIsLeadFormOpen(false)}
			/>
		</>
	);
}
