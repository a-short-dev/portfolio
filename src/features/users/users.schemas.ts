import { z } from 'zod';

export const createUserSchema = z.object({
	email: z.email('Invalid email address'),
	fullName: z.string().trim().min(2, 'Name must be at least 2 characters').optional().or(z.literal('')),
	phoneNumber: z.string().trim().optional().or(z.literal('')),
	password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const updateUserSchema = z.object({
	email: z.string().trim().email('Invalid email address').optional(),
	fullName: z.string().trim().min(2, 'Name must be at least 2 characters').optional().or(z.literal('')),
	phoneNumber: z.string().trim().optional().or(z.literal('')),
	password: z.string().min(8, 'Password must be at least 8 characters').optional().or(z.literal('')),
});

export const userFiltersSchema = z.object({
	search: z.string().optional(),
	page: z.number().int().positive().optional().default(1),
	limit: z.number().int().positive().max(100).optional().default(10),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UserFiltersInput = z.infer<typeof userFiltersSchema>;
