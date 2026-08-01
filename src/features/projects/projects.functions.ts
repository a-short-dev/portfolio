import 'server-only';

import { drizzleProjectRepository } from '@/db/repositories/project.repository';

export async function createProject(data: any) {
	try {
		const existingProject = await drizzleProjectRepository.findBySlug(
			data.slug,
		);
		if (existingProject) {
			return { success: false as const, error: 'Project already exists' };
		}

		const project = await drizzleProjectRepository.create(data);
		return { success: true as const, project };
	} catch {
		return {
			success: false as const,
			error: 'Unable to create project',
		};
	}
}
