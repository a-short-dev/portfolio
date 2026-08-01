import { z } from 'zod';

export const stackSchema = z.object({
	db: z.string().trim().min(1).optional(),
	orm: z.string().trim().min(1).optional(),
	backend: z.string().trim().min(1).optional(),
	frontend: z.string().trim().min(1).optional(),
});

export const createProjectFormSchema = z.object({
	name: z.string().trim().min(1, 'Project name is required'),
	slug: z.string().trim().min(1, 'Project name is required'),
	description: z.string().trim().optional(),
	stack: stackSchema.optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectFormSchema>;

export type Stack = z.infer<typeof stackSchema>;
