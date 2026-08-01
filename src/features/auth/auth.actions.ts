'use server';

import { cookies } from 'next/headers';

import { env } from '@/lib/env/env.next';
import { type LoginFormData, loginFormSchema } from '@/lib/validation';
import { login, signToken } from './auth.functions';

export async function doLoginAction(data: LoginFormData) {
	// Validate input using the form schema
	const parsed = loginFormSchema.safeParse(data);
	if (!parsed.success) {
		return { success: false as const, error: 'Invalid input' };
	}

	// Perform authentication lookup
	const user = await login(parsed.data);
	if (!user) {
		return { success: false as const, error: 'Invalid email or password' };
	}

	try {
		// Generate JWT session token
		const token = await signToken({
			id: user.id,
			email: user.email,
			name: user.name,
		});

		// Set session cookie
		const cookieStore = await cookies();
		cookieStore.set('session', token, {
			httpOnly: true,
			secure: env.NODE_ENV === 'production',
			sameSite: 'lax',
			path: '/',
			maxAge: 2 * 60 * 60, // 2 hours
		});
		const redirectTo = 'admin';
		return { success: true as const, redirectTo, error: null };
	} catch {
		return { success: false as const, error: 'Failed to create login session' };
	}
}



