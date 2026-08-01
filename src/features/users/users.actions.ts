'use server';

import { revalidatePath } from 'next/cache';
import { createUser, deleteUser, updateUser } from './users.functions';
import {
	type CreateUserInput,
	createUserSchema,
	type UpdateUserInput,
	updateUserSchema,
} from './users.schemas';

export async function createUserAction(data: CreateUserInput) {
	const parsed = createUserSchema.safeParse(data);
	if (!parsed.success) {
		return {
			success: false as const,
			error: parsed.error.issues[0]?.message || 'Invalid input',
		};
	}

	try {
		const user = await createUser(parsed.data);
		revalidatePath('/admin/users');
		return { success: true as const, data: user };
	} catch (error) {
		return { success: false as const, error: 'Failed to create user' };
	}
}

export async function updateUserAction(id: number, data: UpdateUserInput) {
	const parsed = updateUserSchema.safeParse(data);
	if (!parsed.success) {
		return {
			success: false as const,
			error: parsed.error.issues[0]?.message || 'Invalid input',
		};
	}

	try {
		const updated = await updateUser(id, parsed.data);
		if (!updated) {
			return { success: false as const, error: 'User not found' };
		}
		revalidatePath('/admin/users');
		return { success: true as const, data: updated };
	} catch (error) {
		return { success: false as const, error: 'Failed to update user' };
	}
}

export async function deleteUserAction(id: number) {
	try {
		const success = await deleteUser(id);
		if (!success) {
			return {
				success: false as const,
				error: 'User not found or already deleted',
			};
		}
		revalidatePath('/admin/users');
		return { success: true as const };
	} catch (error) {
		return { success: false as const, error: 'Failed to delete user' };
	}
}
