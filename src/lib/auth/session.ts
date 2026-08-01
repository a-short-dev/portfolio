import { cookies } from 'next/headers';
import { verifyToken } from '@/features/auth/auth.functions';
import 'server-only';

export async function getCurrentUser() {
	try {
		const cookieStore = await cookies();
		const sessionCookie = cookieStore.get('session');

		if (!sessionCookie?.value) {
			return null;
		}

		// Verify and decode the JWT/opaque session token
		const payload = await verifyToken(sessionCookie.value);

		if (!payload) {
			return null;
		}

		return payload; // Returns { id, email, name, ... }
	} catch (error) {
		console.error('Failed to get current user:', error);
		return null;
	}
}
