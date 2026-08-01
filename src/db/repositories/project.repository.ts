// src/db/repositories/project.repository.ts
import 'server-only';

import { asc, count, desc, eq, ilike, sql } from 'drizzle-orm';
import { db } from '@/db/db';
import { projects } from '@/db/schema';
import type { CreateProjectInput } from '@/features/projects/projects.schema';
import type {
	PaginatedResult,
	ProjectRecord,
	ProjectRepository,
} from '@/lib/auth';

// Helper to convert DB record to ProjectRecord with stack object
function toProjectRecord(
	dbProject: typeof projects.$inferSelect,
): ProjectRecord {
	return {
		id: dbProject.id,
		projectId: dbProject.projectId,
		name: dbProject.name,
		slug: dbProject.slug,
		description: dbProject.description || null,
		stack: {
			db: dbProject.stack?.db || null,
			orm: dbProject.stack?.orm || null,
			backend: dbProject.stack?.backend || null,
			frontend: dbProject.stack?.frontend || null,
		},
		deletedAt: dbProject.deletedAt,
		createdAt: dbProject.createdAt,
		updatedAt: dbProject.updatedAt,
	};
}

export const drizzleProjectRepository: ProjectRepository = {
	async findById(id: string): Promise<ProjectRecord | null> {
		const result = await db
			.select()
			.from(projects)
			.where(eq(projects.projectId, id))
			.limit(1);

		return result.length > 0 ? toProjectRecord(result[0]) : null;
	},

	async findByProjectId(projectId: string): Promise<ProjectRecord | null> {
		const result = await db
			.select()
			.from(projects)
			.where(eq(projects.projectId, projectId))
			.limit(1);

		return result.length > 0 ? toProjectRecord(result[0]) : null;
	},

	async findBySlug(slug: string): Promise<ProjectRecord | null> {
		const result = await db
			.select()
			.from(projects)
			.where(eq(projects.slug, slug))
			.limit(1);

		return result.length > 0 ? toProjectRecord(result[0]) : null;
	},

	async findAll(params?: {
		page?: number;
		limit?: number;
		search?: string;
		sortBy?: 'name' | 'createdAt' | 'updatedAt';
		sortOrder?: 'asc' | 'desc';
	}): Promise<PaginatedResult<ProjectRecord>> {
		const page = params?.page || 1;
		const limit = params?.limit || 10;
		const offset = (page - 1) * limit;
		const search = params?.search || '';
		const sortBy = params?.sortBy || 'createdAt';
		const sortOrder = params?.sortOrder || 'desc';

		// Build where conditions
		let conditions = sql`TRUE`;
		if (search) {
			conditions = sql`${conditions} AND (${ilike(projects.name, `%${search}%`)} OR ${ilike(projects.description, `%${search}%`)})`;
		}

		// Get total count
		const totalResult = await db
			.select({ total: count() })
			.from(projects)
			.where(conditions);

		const total = Number(totalResult[0].total);

		// Apply sorting
		const sortField =
			sortBy === 'name'
				? projects.name
				: sortBy === 'updatedAt'
					? projects.updatedAt
					: projects.createdAt;

		// Get paginated results
		const query = db
			.select()
			.from(projects)
			.where(conditions)
			.orderBy(sortOrder === 'asc' ? asc(sortField) : desc(sortField))
			.limit(limit)
			.offset(offset);

		const results = await query;

		return {
			data: results.map(toProjectRecord),
			total,
			page,
			limit,
			totalPages: Math.ceil(total / limit),
			hasNext: page * limit < total,
			hasPrevious: page > 1,
		};
	},

	async create(data: CreateProjectInput): Promise<ProjectRecord> {
		const [result] = await db
			.insert(projects)
			.values({
				name: data.name,
				slug: data.slug.trim(),
				description: data.description || null,
				stack: data.stack || null,
			})
			.returning();

		return toProjectRecord(result);
	},

	async update(
		id: string,
		data: Partial<CreateProjectInput>,
	): Promise<ProjectRecord | null> {
		// Check if project exists
		const existing = await this.findById(id);
		if (!existing) return null;

		// Prepare update data
		const updateData: Partial<typeof projects.$inferInsert> = {
			...(data.name && { name: data.name }),
			...(data.slug && { slug: data.slug }),
			...(data.description !== undefined && {
				description: data.description || null,
			}),
			...(data.stack && {
				stack: data.stack,
			}),
			updatedAt: new Date(),
		};

		const [result] = await db
			.update(projects)
			.set(updateData)
			.where(eq(projects.projectId, id))
			.returning();

		return result ? toProjectRecord(result) : null;
	},

	async softDelete(id: string): Promise<boolean> {
		const [result] = await db
			.update(projects)
			.set({
				deletedAt: new Date(),
				updatedAt: new Date(),
			})
			.where(eq(projects.projectId, id))
			.returning();

		return !!result;
	},

	async hardDelete(id: string): Promise<boolean> {
		const [result] = await db
			.delete(projects)
			.where(eq(projects.projectId, id))
			.returning();

		return !!result;
	},

	async restore(id: string): Promise<boolean> {
		const [result] = await db
			.update(projects)
			.set({
				deletedAt: null,
				updatedAt: new Date(),
			})
			.where(eq(projects.projectId, id))
			.returning();

		return !!result;
	},
};
