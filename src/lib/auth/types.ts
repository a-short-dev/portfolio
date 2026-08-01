/**
 * Auth Library Types
 *
 * ORM-agnostic type contracts for the auth system.
 * Business logic depends on these — never on ORM-specific types.
 */

import type {
	CreateProjectInput,
	Stack,
} from '@/features/projects/projects.schema';

/** The raw user record as stored in the database (including sensitive fields). */
export interface UserRecord {
	id: number;
	name: string | null;
	email: string;
	phone: string | null;
	password: string | null;
	roles: object | null;
}

/** A safe, client-facing subset of the user — no secrets, no internal fields. */
export interface UserDTO {
	id: number;
	name: string | null;
	email: string;
	roles: object | null;
}

/** The contract any user repository must fulfill. */
export interface UserRepository {
	findByEmail(email: string): Promise<UserRecord | null>;

	findById(id: number): Promise<UserRecord | null>;

	findAll(params: {
		search?: string;
		page?: number;
		limit?: number;
	}): Promise<{ users: UserRecord[]; total: number }>;

	create(data: {
		email: string;
		fullName?: string;
		phoneNumber?: string;
		password?: string;
	}): Promise<UserRecord>;

	update(
		id: number,
		data: {
			email?: string;
			fullName?: string;
			phoneNumber?: string;
			password?: string;
		},
	): Promise<UserRecord | null>;

	softDelete(id: number): Promise<boolean>;
}

// Create DTO
export type CreateProjectDTO = {
	name: string;
	slug: string;
	description?: string;
	stack?: Stack;
};

// Update DTO
export type UpdateProjectDTO = Partial<CreateProjectDTO>;

// Project record with all fields
export interface ProjectRecord {
	id: number; // if using serial
	projectId: string;
	name: string;
	slug: string;
	description: string | null;
	stack: {
		db: string | null;
		orm: string | null;
		backend: string | null;
		frontend: string | null;
	} | null;
	createdAt: Date;
	updatedAt: Date;
	deletedAt: Date | null; // for soft delete
}

export interface PaginatedResult<T> {
	data: T[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
	hasNext: boolean;
	hasPrevious: boolean;
}

// Project repository interface
export interface ProjectRepository {
	findById(id: string): Promise<ProjectRecord | null>;

	findByProjectId(projectId: string): Promise<ProjectRecord | null>;

	findBySlug(slug: string): Promise<ProjectRecord | null>;

	findAll(options?: {
		page?: number;
		limit?: number;
		search?: string;
		filter?: {
			hasDb?: string;
			hasOrm?: string;
			hasBackend?: string;
			hasFrontend?: string;
		};
		sort?: {
			field: 'name' | 'createdAt' | 'updatedAt';
			order: 'asc' | 'desc';
		};
		includeDeleted?: boolean;
	}): Promise<PaginatedResult<ProjectRecord>>;

	create(data: CreateProjectInput): Promise<ProjectRecord>;

	update(
		id: string,
		data: Partial<CreateProjectInput>,
	): Promise<ProjectRecord | null>;

	softDelete(id: string): Promise<boolean>;

	hardDelete(id: string): Promise<boolean>; // Optional: permanent deletion

	restore(id: string): Promise<boolean>; // Optional: restore
}
