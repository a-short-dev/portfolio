import { z } from 'zod';

export const contactFormSchema = z.object({
	name: z.string().trim().min(2, 'Name must be at least 2 characters'),
	email: z.email('Invalid email address'),
	message: z
		.string()
		.trim()
		.min(10, 'Message must be at least 10 characters')
		.max(350, 'Message must be under 350 characters'),
});

export const whatsappLeadSchema = contactFormSchema.extend({
	projectType: z.string().trim().min(1, 'Please select a project type'),
});

export const chatInputSchema = z.object({
	message: z
		.string()
		.min(1, 'Message cannot be empty')
		.max(1000, 'Message is too long'),
	history: z
		.array(
			z.object({
				role: z.enum(['user', 'assistant']),
				content: z.string(),
			}),
		)
		.optional(),
});

export const contactResponseSchema = z.object({
	success: z.boolean(),
});

export const spotifyNowPlayingSchema = z.object({
	isPlaying: z.boolean(),
	title: z.string().optional(),
	artist: z.string().optional(),
	album: z.string().optional(),
	albumImageUrl: z.string().optional(),
	songUrl: z.string().optional(),
	progressMs: z.number().optional(),
	durationMs: z.number().optional(),
});

export const loginFormSchema = z.object({
	email: z.email(),
	password: z.string().min(8).max(40),
});

export type LoginFormData = z.infer<typeof loginFormSchema>;
export type ContactFormData = z.infer<typeof contactFormSchema>;
export type SpotifyNowPlaying = z.infer<typeof spotifyNowPlayingSchema>;
export type ChatInput = z.infer<typeof chatInputSchema>;
