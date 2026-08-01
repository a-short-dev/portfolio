import 'server-only';
import { hash, verify } from '@node-rs/argon2';

export async function hashPassword(password: string): Promise<string> {
	// Uses argon2id by default with safe memory/time defaults
	return await hash(password, {
		memoryCost: 19456, // ~19 MiB, OWASP min recommendation
		timeCost: 2,
		outputLen: 32,
		parallelism: 1,
	});
}

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
