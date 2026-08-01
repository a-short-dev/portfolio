// src/db/repositories/user.repository.ts
import 'server-only';
import { eq } from 'drizzle-orm';
import { db } from '@/db/db';
import { roles, userRoles, users } from '@/db/schema';
import type { UserRecord, UserRepository } from '@/lib/auth/types';

/**
 * Fetches all roles assigned to a specific user by their ID.
 * Returns an array of objects containing the role name and ID.
 */
export async function getUserRolesByUserId(
	userId: number,
): Promise<Array<{ roleName: string; roleId: number }>> {
	const result = await db
		.select({
			roleName: roles.name,
			roleId: roles.id,
		})
		.from(users)
		.innerJoin(userRoles, eq(users.id, userRoles.userId))
		.innerJoin(roles, eq(userRoles.roleId, roles.id))
		.where(eq(users.id, userId));

	return result;
}

/**
 * Functional Drizzle implementation of the UserRepository interface contract.
 * Uses standard query builder for maximum type safety and compatibility.
 */
import { and, count, ilike, isNull, or } from 'drizzle-orm';

export const drizzleUserRepository: UserRepository = {
	async findByEmail(email: string): Promise<UserRecord | null> {
		const [user] = await db
			.select()
			.from(users)
			.where(and(eq(users.email, email), isNull(users.deletedAt)))
			.limit(1);

		if (!user) {
			return null;
		}

		const assignedRoles = await getUserRolesByUserId(user.id);

		return {
			id: user.id,
			name: user.fullName,
			email: user.email,
			phone: user.phoneNumber,
			password: user.password,
			roles: assignedRoles,
		};
	},

	async findById(id: number): Promise<UserRecord | null> {
		const [user] = await db
			.select()
			.from(users)
			.where(and(eq(users.id, id), isNull(users.deletedAt)))
			.limit(1);

		if (!user) {
			return null;
		}

		const assignedRoles = await getUserRolesByUserId(user.id);

		return {
			id: user.id,
			name: user.fullName,
			email: user.email,
			phone: user.phoneNumber,
			password: user.password,
			roles: assignedRoles,
		};
	},

	async findAll(params: { search?: string; page?: number; limit?: number }) {
		const page = params.page && params.page > 0 ? params.page : 1;
		const limit = params.limit && params.limit > 0 ? params.limit : 10;
		const offset = (page - 1) * limit;

		const whereConditions = [isNull(users.deletedAt)];

		if (params.search && params.search.trim() !== '') {
			const searchTerm = `%${params.search.trim()}%`;
			whereConditions.push(
				or(
					ilike(users.email, searchTerm),
					ilike(users.fullName, searchTerm),
					ilike(users.phoneNumber, searchTerm),
				)!,
			);
		}

		const combinedWhere = and(...whereConditions);

		const [totalResult] = await db
			.select({ total: count() })
			.from(users)
			.where(combinedWhere);

		const userRows = await db
			.select()
			.from(users)
			.where(combinedWhere)
			.limit(limit)
			.offset(offset);

		const records: UserRecord[] = await Promise.all(
			userRows.map(async (u) => {
				const assignedRoles = await getUserRolesByUserId(u.id);
				return {
					id: u.id,
					name: u.fullName,
					email: u.email,
					phone: u.phoneNumber,
					password: u.password,
					roles: assignedRoles,
				};
			}),
		);

		return {
			users: records,
			total: totalResult?.total ?? 0,
		};
	},

	async create(data: {
		email: string;
		fullName?: string;
		phoneNumber?: string;
		password?: string;
	}): Promise<UserRecord> {
		const [newUser] = await db
			.insert(users)
			.values({
				email: data.email,
				fullName: data.fullName,
				phoneNumber: data.phoneNumber,
				password: data.password,
			})
			.returning();

		return {
			id: newUser.id,
			name: newUser.fullName,
			email: newUser.email,
			phone: newUser.phoneNumber,
			password: newUser.password,
			roles: [],
		};
	},

	async update(
		id: number,
		data: {
			email?: string;
			fullName?: string;
			phoneNumber?: string;
			password?: string;
		},
	): Promise<UserRecord | null> {
		const [updatedUser] = await db
			.update(users)
			.set({
				...data,
				updatedAt: new Date(),
			})
			.where(and(eq(users.id, id), isNull(users.deletedAt)))
			.returning();

		if (!updatedUser) return null;

		const assignedRoles = await getUserRolesByUserId(updatedUser.id);

		return {
			id: updatedUser.id,
			name: updatedUser.fullName,
			email: updatedUser.email,
			phone: updatedUser.phoneNumber,
			password: updatedUser.password,
			roles: assignedRoles,
		};
	},

	async softDelete(id: number): Promise<boolean> {
		const [deleted] = await db
			.update(users)
			.set({ deletedAt: new Date() })
			.where(and(eq(users.id, id), isNull(users.deletedAt)))
			.returning();

		return !!deleted;
	},
};
