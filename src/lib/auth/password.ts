import 'server-only';
import { hash, verify } from '@node-rs/argon2';

/**
 * Hashes a plaintext password using Argon2id with safe default configurations.
 */
export async function hashPassword(password: string): Promise<string> {
	return await hash(password, {
		memoryCost: 19456, // ~19 MiB, OWASP minimum recommendation
		timeCost: 2,
		outputLen: 32,
		parallelism: 1,
	});
}

/**
 * Verifies a plaintext password against an Argon2 hash string.
 */
export async function verifyPassword(
	password: string,
	hashStr: string,
): Promise<boolean> {
	try {
		return await verify(hashStr, password);
	} catch {
		return false;
	}
}
