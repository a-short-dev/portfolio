import { neon } from '@neondatabase/serverless';
import { loadEnvConfig } from '@next/env';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/neon-http';
import { hashPassword } from '../lib/auth/password';
import { roles, userRoles, users } from './schema';

loadEnvConfig(process.cwd());

if (!process.env.DATABASE_URL) {
	throw new Error('DATABASE_URL is not set in the environment');
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle({ client: sql });

export const GLOBAL_RESERVED_ROLES = [
	'plaform-super-admin',
	'platform-admin',
	'support-agent',
] as const;

export const TENANT_DEFAULT_ROLES = ['super-admin', 'admin', 'staff'] as const;

const main = async () => {
	try {
		console.log('⏳ Seeding database...');

		// Clear existing users to ensure clean seeding
		await db.delete(users);

		const globalRolesData = GLOBAL_RESERVED_ROLES.map((name) => ({
			name,
			isInternal: true,
			isSystem: true,
			tenantId: null, // Global roles do not belong to a specific tenant
		}));

		// 2. Prepare Default Tenant Roles (isSystem: false, template roles for businesses)
		const tenantDefaultRolesData = TENANT_DEFAULT_ROLES.map((name) => ({
			name,
			isInternal: false,
			isSystem: false,
			tenantId: null, // Can serve as system templates or base blueprints
		}));

		const allRolesToSeed = [...globalRolesData, ...tenantDefaultRolesData];

		// 3. Upsert into database to prevent duplicate key errors on re-runs
		for (const role of allRolesToSeed) {
			await db.insert(roles).values(role).onConflictDoNothing(); // Adjust based on your unique constraints (e.g., composite key of tenantId + name)
		}

		const passwordSups = await hashPassword('password123@');
		const passwordAda = await hashPassword('password123');
		const passwordAlan = await hashPassword('password456');

		// Insert mock users with secure Argon2 hashes
		const insertedUsers = await db
			.insert(users)
			.values([
				{
					fullName: 'Oluwaleke Abiodun',
					email: 'lakessyde@gmail.com',
					phoneNumber: '+2349165913234',
					password: passwordSups,
				},
				{
					fullName: 'Ada Lovelace',
					email: 'ada@example.com',
					phoneNumber: '+15550100',
					password: passwordAda,
				},
				{
					fullName: 'Alan Turing',
					email: 'alan@example.com',
					phoneNumber: '+15550200',
					password: passwordAlan,
				},
			])
			.returning({ id: users.id, email: users.email });

		// 2. Fetch the ID of the 'plaform-super-admin' role
		const [platformSuperAdminRole] = await db
			.select()
			.from(roles)
			.where(eq(roles.name, 'plaform-super-admin'))
			.limit(1);

		const superAdminUser = insertedUsers.find(
			(u) => u.email === 'lakessyde@gmail.com',
		);

		// 3. Assign 'plaform-super-admin' to ONLY ONE designated user
		if (platformSuperAdminRole && superAdminUser) {
			await db.insert(userRoles).values({
				userId: superAdminUser.id,
				roleId: platformSuperAdminRole.id,
			});
			console.log(
				'👑 Assigned platform-super-admin strictly to Oluwaleke Abiodun.',
			);
		}

		console.log('✅ Seeding completed successfully');

		console.log('✅ Seeding completed successfully');
		process.exit(0);
	} catch (error) {
		console.error('❌ Error during seeding:', error);
		process.exit(1);
	}
};

main();
