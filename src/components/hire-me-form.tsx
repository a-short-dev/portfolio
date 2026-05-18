"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "./ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

const formSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters"),
	email: z.string().email("Invalid email address"),
	message: z
		.string()
		.min(10, "Message must be at least 10 characters")
		.max(350, "Message must be under 350 characters"),
});

export default function HireMeForm() {
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		mode: "onChange",
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			email: "",
			message: "",
		},
	});

	const handleSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (
		data,
	) => {
		setIsSubmitting(true);
		try {
			const response = await fetch("/api/send/", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});

			const result = await response.json();
			if (!response.ok)
				throw new Error(result.message || "Something went wrong");

			toast.success("Message sent successfully!");
			form.reset();
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : "Failed to send message";
			toast.error(errorMessage);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Form {...form}>
			<motion.form
				onSubmit={form.handleSubmit(handleSubmit)}
				className="w-full max-w-4xl mx-auto px-6 md:px-0 space-y-8 relative z-10"
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8 }}
				viewport={{ once: true }}
			>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5, delay: 0.1 }}
						viewport={{ once: true }}
					>
						<FormField
							name="name"
							control={form.control}
							render={({ field }) => (
								<FormItem className="w-full">
									<FormLabel className="text-xs font-bold uppercase tracking-widest text-accent mb-3 block">
										Full Name
									</FormLabel>
									<FormControl>
										<Input
											{...field}
											type="text"
											className="w-full h-14 px-6 bg-black border border-white/10 rounded-none text-white placeholder:text-white/20 focus:border-accent focus:ring-0 transition-all duration-300"
											placeholder="Oluwaleke Abiodun"
											aria-invalid={!!form.formState.errors.name}
											aria-describedby="name-error"
										/>
									</FormControl>
									<FormMessage
										id="name-error"
										className="text-red-500 text-xs mt-2"
									/>
								</FormItem>
							)}
						/>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, x: 20 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
						viewport={{ once: true }}
					>
						<FormField
							name="email"
							control={form.control}
							render={({ field }) => (
								<FormItem className="w-full">
									<FormLabel className="text-xs font-bold uppercase tracking-widest text-accent mb-3 block">
										Email Address
									</FormLabel>
									<FormControl>
										<Input
											{...field}
											type="email"
											className="w-full h-14 px-6 bg-black border border-white/10 rounded-none text-white placeholder:text-white/20 focus:border-accent focus:ring-0 transition-all duration-300"
											placeholder="leke@architect.digital"
											aria-invalid={!!form.formState.errors.email}
											aria-describedby="email-error"
										/>
									</FormControl>
									<FormMessage
										id="email-error"
										className="text-red-500 text-xs mt-2"
									/>
								</FormItem>
							)}
						/>
					</motion.div>
				</div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.3 }}
					viewport={{ once: true }}
				>
					<FormField
						name="message"
						control={form.control}
						render={({ field }) => (
							<FormItem className="w-full">
								<FormLabel className="text-xs font-bold uppercase tracking-widest text-accent mb-3 block">
									Your Brief
								</FormLabel>
								<FormControl>
									<Textarea
										{...field}
										className="w-full min-h-[160px] px-6 py-4 bg-black border border-white/10 rounded-none text-white placeholder:text-white/20 focus:border-accent focus:ring-0 transition-all duration-300 resize-none"
										placeholder="Describe the architectural vision for your digital realm..."
										aria-invalid={!!form.formState.errors.message}
										aria-describedby="message-error"
										rows={6}
									/>
								</FormControl>
								<FormMessage
									id="message-error"
									className="text-red-500 text-xs mt-2"
								/>
							</FormItem>
						)}
					/>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.4 }}
					viewport={{ once: true }}
				>
					<Button
						type="submit"
						className="w-full h-16 bg-white/5 hover:bg-accent text-white hover:text-black border border-white/10 hover:border-accent text-xs font-black uppercase tracking-[0.2em] rounded-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
						disabled={isSubmitting}
					>
						<span className="relative z-10">
							{isSubmitting ? (
								<div className="flex items-center gap-3">
									<div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
									<span>Initializing Protocol...</span>
								</div>
							) : (
								"Send Message"
							)}
						</span>
					</Button>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.5 }}
					viewport={{ once: true }}
					className="text-center"
				>
					<div className="flex items-center gap-4 my-6">
						<div className="h-px bg-white/10 flex-1"></div>
						<span className="text-[10px] uppercase tracking-widest text-white/30 font-mono">
							Or Secure Line
						</span>
						<div className="h-px bg-white/10 flex-1"></div>
					</div>

					<a
						href="https://wa.me/2349165913234"
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex items-center justify-center gap-3 w-full h-14 bg-[#25D366]/10 hover:bg-[#25D366] border border-[#25D366]/30 hover:border-[#25D366] text-[#25D366] hover:text-black transition-all duration-300 group"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							fill="currentColor"
							viewBox="0 0 16 16"
						>
							<path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
						</svg>
						<span className="text-xs font-black uppercase tracking-[0.2em]">
							Deploy via WhatsApp
						</span>
					</a>
				</motion.div>
			</motion.form>
		</Form>
	);
}
