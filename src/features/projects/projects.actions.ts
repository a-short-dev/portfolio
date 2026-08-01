'use server';

import {
	type CreateProjectInput,
	createProjectFormSchema,
} from './projects.schema';

export async function createProjectAction(data: CreateProjectInput) {
	const parsed = createProjectFormSchema.safeParse(data);
	if (!parsed.success) {
		return { success: false as const, error: 'Invalid input' };
	}
}
