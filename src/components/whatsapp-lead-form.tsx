"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Send, X } from "lucide-react";
import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";

interface WhatsAppLeadFormProps {
	isOpen: boolean;
	onClose: () => void;
}

interface FormData {
	name: string;
	email: string;
	projectType: string;
	message: string;
}

const PROJECT_TYPES = [
	"E-commerce Platform",
	"SaaS Application",
	"Mobile App (iOS/Android)",
	"Real Estate/Booking System",
	"Fintech Solution",
	"Content Management System",
	"Custom Web Application",
	"API/Backend Development",
	"Other",
];

export default function WhatsAppLeadForm({
	isOpen,
	onClose,
}: WhatsAppLeadFormProps) {
	const [formData, setFormData] = useState<FormData>({
		name: "",
		email: "",
		projectType: "",
		message: "",
	});
	const [errors, setErrors] = useState<Partial<FormData>>({});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const validateEmail = (email: string): boolean => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	const validateForm = (): boolean => {
		const newErrors: Partial<FormData> = {};

		if (!formData.name.trim()) {
			newErrors.name = "Name is required";
		}

		if (!formData.email.trim()) {
			newErrors.email = "Email is required";
		} else if (!validateEmail(formData.email)) {
			newErrors.email = "Invalid email format";
		}

		if (!formData.projectType) {
			newErrors.projectType = "Please select a project type";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) return;

		setIsSubmitting(true);

		// Format WhatsApp message with user information
		const whatsappMessage = `Hi! I'm ${formData.name}

📧 Email: ${formData.email}
🎯 Project Type: ${formData.projectType}
${formData.message ? `\n💬 Message: ${formData.message}` : ""}

I'd like to discuss this project with you.`;

		const phoneNumber = "+2349165913234";
		const encodedMessage = encodeURIComponent(whatsappMessage);
		const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

		// Small delay for UX
		setTimeout(() => {
			window.open(whatsappUrl, "_blank");
			setIsSubmitting(false);

			// Reset form and close
			setFormData({ name: "", email: "", projectType: "", message: "" });
			onClose();
		}, 500);
	};

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		// Clear error when user starts typing
		if (errors[name as keyof FormData]) {
			setErrors((prev) => ({ ...prev, [name]: undefined }));
		}
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					{/* Backdrop */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
						className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[150]"
					/>

					{/* Modal */}
					<motion.div
						initial={{ opacity: 0, scale: 0.9, y: 20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.9, y: 20 }}
						transition={{ type: "spring", stiffness: 300, damping: 30 }}
						className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-md bg-black border border-white/20 rounded-lg shadow-2xl z-[200] overflow-hidden"
					>
						{/* Header */}
						<div className="bg-white text-black p-4 flex items-center justify-between border-b border-white/10">
							<div className="flex items-center gap-3">
								<div className="p-2 bg-black text-white rounded-full">
									<FaWhatsapp size={20} />
								</div>
								<div>
									<h3 className="font-bold uppercase tracking-wider text-sm">
										Project Inquiry
									</h3>
									<p className="text-[10px] text-black/60 font-mono uppercase tracking-widest">
										Let's Build Together
									</p>
								</div>
							</div>
							<button
								type="button"
								onClick={onClose}
								className="text-black/60 hover:text-black transition-colors"
							>
								<X size={20} />
							</button>
						</div>

						{/* Form */}
						<form onSubmit={handleSubmit} className="p-6 space-y-4">
							{/* Name Field */}
							<div>
								<label
									htmlFor="name"
									className="block text-[10px] font-bold uppercase tracking-widest text-white/60 mb-2"
								>
									Your Name *
								</label>
								<input
									type="text"
									id="name"
									name="name"
									value={formData.name}
									onChange={handleChange}
									className={`w-full bg-white/5 border ${
										errors.name ? "border-red-500" : "border-white/20"
									} text-white px-4 py-2.5 text-sm focus:outline-none focus:border-white/40 transition-colors`}
									placeholder="John Doe"
								/>
								{errors.name && (
									<div className="flex items-center gap-1 mt-1 text-red-400 text-xs">
										<AlertCircle size={12} />
										<span>{errors.name}</span>
									</div>
								)}
							</div>

							{/* Email Field */}
							<div>
								<label
									htmlFor="email"
									className="block text-[10px] font-bold uppercase tracking-widest text-white/60 mb-2"
								>
									Email Address *
								</label>
								<input
									type="email"
									id="email"
									name="email"
									value={formData.email}
									onChange={handleChange}
									className={`w-full bg-white/5 border ${
										errors.email ? "border-red-500" : "border-white/20"
									} text-white px-4 py-2.5 text-sm focus:outline-none focus:border-white/40 transition-colors`}
									placeholder="john@example.com"
								/>
								{errors.email && (
									<div className="flex items-center gap-1 mt-1 text-red-400 text-xs">
										<AlertCircle size={12} />
										<span>{errors.email}</span>
									</div>
								)}
							</div>

							{/* Project Type */}
							<div>
								<label
									htmlFor="projectType"
									className="block text-[10px] font-bold uppercase tracking-widest text-white/60 mb-2"
								>
									Project Type *
								</label>
								<select
									id="projectType"
									name="projectType"
									value={formData.projectType}
									onChange={handleChange}
									className={`w-full bg-white/5 border ${
										errors.projectType ? "border-red-500" : "border-white/20"
									} text-white px-4 py-2.5 text-sm focus:outline-none focus:border-white/40 transition-colors`}
								>
									<option value="" className="bg-black">
										Select project type
									</option>
									{PROJECT_TYPES.map((type) => (
										<option key={type} value={type} className="bg-black">
											{type}
										</option>
									))}
								</select>
								{errors.projectType && (
									<div className="flex items-center gap-1 mt-1 text-red-400 text-xs">
										<AlertCircle size={12} />
										<span>{errors.projectType}</span>
									</div>
								)}
							</div>

							{/* Message (Optional) */}
							<div>
								<label
									htmlFor="message"
									className="block text-[10px] font-bold uppercase tracking-widest text-white/60 mb-2"
								>
									Brief Message (Optional)
								</label>
								<textarea
									id="message"
									name="message"
									value={formData.message}
									onChange={handleChange}
									rows={3}
									className="w-full bg-white/5 border border-white/20 text-white px-4 py-2.5 text-sm focus:outline-none focus:border-white/40 transition-colors resize-none"
									placeholder="Tell me about your project..."
								/>
							</div>

							{/* Submit Button */}
							<button
								type="submit"
								disabled={isSubmitting}
								className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white text-black font-bold tracking-wider text-xs uppercase hover:bg-white/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{isSubmitting ? (
									<>
										<div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
										<span>Opening WhatsApp...</span>
									</>
								) : (
									<>
										<FaWhatsapp size={16} />
										<span>Continue to WhatsApp</span>
										<Send size={14} />
									</>
								)}
							</button>

							<p className="text-center text-[10px] text-white/40 font-mono">
								Your info will be sent via WhatsApp
							</p>
						</form>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
}
