"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "./ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";

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
			</motion.form>
		</Form>
	);
}
