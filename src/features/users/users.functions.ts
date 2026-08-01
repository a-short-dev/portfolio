import 'server-only';

import { drizzleUserRepository } from '@/db/repositories/user.repository';
import { hashPassword } from '@/lib/auth/password';
import type { UserDTO } from '@/lib/auth/types';
import { requireCurrentUser } from '../auth/auth.functions';
import type {
	CreateUserInput,
	UpdateUserInput,
	UserFiltersInput,
} from './users.schemas';

function toUserDTO(record: any): UserDTO {
	return {
		id: record.id,
		name: record.name,
		email: record.email,
		roles: record.roles,
	};
}

export async function getUsers(
	filters: UserFiltersInput = {
		page: 1,
		limit: 10,
	},
) {
	const user = await requireCurrentUser();
	const result = await drizzleUserRepository.findAll(filters);
	return {
		users: result.users.map(toUserDTO),
		total: result.total,
	};
}

export async function getUserById(id: number): Promise<UserDTO | null> {
	const user = await drizzleUserRepository.findById(id);
	return user ? toUserDTO(user) : null;
}

export async function createUser(data: CreateUserInput): Promise<UserDTO> {
	const hashedPassword = data.password
		? await hashPassword(data.password)
		: undefined;
	const created = await drizzleUserRepository.create({
		email: data.email,
		fullName: data.fullName || undefined,
		phoneNumber: data.phoneNumber || undefined,
		password: hashedPassword,
	});
	return toUserDTO(created);
}

export async function updateUser(
	id: number,
	data: UpdateUserInput,
): Promise<UserDTO | null> {
	const updateData: {
		email?: string;
		fullName?: string;
		phoneNumber?: string;
		password?: string;
	} = {};

	if (data.email) updateData.email = data.email;
	if (data.fullName !== undefined)
		updateData.fullName = data.fullName || undefined;
	if (data.phoneNumber !== undefined)
		updateData.phoneNumber = data.phoneNumber || undefined;
	if (data.password && data.password.trim() !== '') {
		updateData.password = await hashPassword(data.password);
	}

	const updated = await drizzleUserRepository.update(id, updateData);
	return updated ? toUserDTO(updated) : null;
}

export async function deleteUser(id: number): Promise<boolean> {
	return await drizzleUserRepository.softDelete(id);
}
