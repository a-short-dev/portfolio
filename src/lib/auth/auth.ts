import 'server-only';
import { log } from '@/lib/logger';
import type { LoginFormData } from '@/lib/validation';
import { verifyPassword } from './password';
import type { UserDTO, UserRepository } from './types';

/**
 * Functional service layer for managing authentication business logic.
 * Decoupled from classes and ORM persistence dependencies.
 */
export const createAuthService = (userRepository: UserRepository) => {
	return {
		/**
		 * Authenticates user credentials and returns a safe DTO on success.
		 */
		async authenticate(data: LoginFormData): Promise<UserDTO | null> {
			try {
				const user = await userRepository.findByEmail(data.email);

				if (!user?.password) {
					log.warn(
						'Authentication failed: user not found or credentials missing',
						{ email: data.email },
					);
					return null;
				}

				// Verify the password using Argon2
				const isValid = await verifyPassword(data.password, user.password);
				if (!isValid) {
					log.warn('Authentication failed: invalid password', {
						email: data.email,
					});
					return null;
				}

				

				// Return ORM-agnostic DTO
				return {
					id: user.id,
					name: user.name,
					email: user.email,
					roles: user.roles,
				};
			} catch (error) {
				log.error('Database query exception during authentication:', {
					err: error,
				});
				throw error;
			}
		},
	};
};
