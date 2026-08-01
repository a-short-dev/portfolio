//src/features/auth/auth.functions.ts
import 'server-only';

import { drizzleUserRepository } from '@/db/repositories/user.repository';
import { createAuthService, getCurrentUser } from '@/lib/auth';
import type { LoginFormData } from '@/lib/validation';
import 'server-only';
import { jwtVerify, SignJWT } from 'jose';
import { env } from '@/lib/env/env.next';

const secret = new TextEncoder().encode(env.OWNER_SECRET_KEY);

/**
 * Signs a safe user payload into a JWT token using HS256 algorithm.
 */
export async function signToken(payload: {
	id: number;
	email: string;
	name: string | null;
}) {
	return await new SignJWT(payload)
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setExpirationTime('2h')
		.sign(secret);
}

/**
 * Verifies a JWT session token and returns the decoded payload, or null if invalid/expired.
 */
export async function verifyToken(token: string) {
	try {
		const { payload } = await jwtVerify(token, secret, {
			algorithms: ['HS256'],
		});
		return payload as { id: number; email: string; name: string | null };
	} catch {
		return null;
	}
}
/**
 * Retrieves the current authenticated user or throws a standardized Unauthorized error.
 * Reusable across Server Actions and Server Components.
 */
export async function requireCurrentUser() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  return user;
}

const authService = createAuthService(drizzleUserRepository);

/** 
 * Validates user credentials by searching the database and verifying the password.
 * Delegates the query and validation logic to the ORM-agnostic AuthService library.
 */
export async function login(data: LoginFormData) {
	return await authService.authenticate(data);
}


