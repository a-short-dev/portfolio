import { neon } from '@neondatabase/serverless';
import { loadEnvConfig } from '@next/env';
import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';

loadEnvConfig(process.cwd());

if (!process.env.DATABASE_URL) {
	throw new Error('DATABASE_URL is not set in the environment');
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle({ client: sql });

const runMigration = async () => {
	try {
		console.log('⏳ Running database migrations...');
		await migrate(db, { migrationsFolder: './src/db/drizzle' });
		console.log('✅ Migrations applied successfully');
		process.exit(0);
	} catch (error) {
		console.error('❌ Error during migration:', error);
		process.exit(1);
	}
};

runMigration();
