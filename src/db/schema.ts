import { eq } from 'drizzle-orm';
import {
	boolean,
	integer,
	jsonb,
	pgTable,
	primaryKey,
	serial,
	snakeCase,
	text,
	timestamp,
	uniqueIndex,
	uuid,
	varchar,
} from 'drizzle-orm/pg-core';

export const projects = snakeCase.table(
	'projects',
	{
		id: serial().primaryKey(),
		projectId: uuid().defaultRandom().notNull(),
		name: text().notNull(),
		slug: text().notNull(),
		description: text(),
		stack: jsonb().$type<{
			db?: string;
			orm?: string;
			backend?: string;
			frontend?: string;
		}>(), // Store stack as JSON
		deletedAt: timestamp(), // null = active, timestamp = soft deleted
		isArchived: boolean().default(false).notNull(), // Data retention classification
		createdAt: timestamp().defaultNow().notNull(),
		updatedAt: timestamp().defaultNow().notNull(),
	},
	(t) => [
		uniqueIndex('unique_project_name_slug').on(t.name, t.slug),
		uniqueIndex('unique_project_slug').on(t.slug),
	],
);

// 1. Sessions Table (Supports multi-device, multiple sessions per user, and device limits)
export const sessions = snakeCase.table('sessions', {
	id: serial().primaryKey(),
	userId: integer()
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	token: text().notNull().unique(), // Unique opaque token or JWT JTI
	deviceInfo: text(), // e.g., "Chrome on macOS", "iPhone 15 Pro"
	ipAddress: text(),
	userAgent: text(),
	isValid: boolean().default(true).notNull(), // Instant revocation flag
	expiresAt: timestamp().notNull(),
	createdAt: timestamp().defaultNow().notNull(),
	updatedAt: timestamp().defaultNow().notNull(),
});

// 2. Verification Tokens Table (For email verification, password resets, magic links, 2FA)
export const verificationTokens = snakeCase.table('verification_tokens', {
	id: serial().primaryKey(),
	userId: integer().references(() => users.id, { onDelete: 'cascade' }), // Optional if token is sent before account creation/lookup
	identifier: text().notNull(), // Usually email or phone number
	token: text().notNull().unique(), // Hashed token or OTP code
	type: text().notNull(), // e.g., 'EMAIL_VERIFICATION', 'PASSWORD_RESET', 'TWO_FACTOR'
	attempts: integer().default(0).notNull(), // Rate limiting/brute force prevention
	expiresAt: timestamp().notNull(),
	createdAt: timestamp().defaultNow().notNull(),
});

export const users = snakeCase.table('users', {
	id: serial().primaryKey(),
	email: text().unique().notNull(),
	phoneNumber: text().unique(),
	password: text(),
	fullName: text(),
	// Soft deletes & Compliance
	deletedAt: timestamp(), // null = active, timestamp = soft deleted
	isArchived: boolean().default(false).notNull(), // Data retention classification
	createdAt: timestamp().defaultNow().notNull(),
	updatedAt: timestamp().defaultNow().notNull(),
});

export const roles = snakeCase.table('roles', {
	id: serial().primaryKey(),
	name: text().notNull().unique(),
	isInternal: boolean().default(false).notNull(),
	isSystem: boolean().default(false).notNull(),
	deletedAt: timestamp(), // Soft delete support for custom roles
	createdAt: timestamp().defaultNow().notNull(),
});

export const userRoles = snakeCase.table(
	'user_roles',
	{
		userId: integer()
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		roleId: integer()
			.notNull()
			.references(() => roles.id, { onDelete: 'cascade' }),
		assignedAt: timestamp().defaultNow().notNull(),
	},
	(t) => [
		primaryKey({
			columns: [t.userId, t.roleId],
		}),
		uniqueIndex('unique_platform_super_admin')
			.on(t.roleId)
			.where(eq(t.roleId, 1)),
	],
);

// Audit Trail & Compliance Schema
export const auditLogs = snakeCase.table('audit_logs', {
	id: serial().primaryKey(),
	actorId: integer().references(() => users.id, { onDelete: 'set null' }), // Who performed the action
	action: text().notNull(), // e.g., 'USER_CREATED', 'ROLE_ASSIGNED', 'DATA_EXPORTED'
	targetTable: text().notNull(), // e.g., 'users', 'roles'
	targetId: integer(), // ID of the affected record
	changes: jsonb(), // Snapshot of before/after or payload details for compliance tracking
	ipAddress: text(),
	userAgent: text(),
	createdAt: timestamp().defaultNow().notNull(),
});

export const cookieConsentConfigs = snakeCase.table('cookie_consent_configs', {
	id: serial().primaryKey(),
	version: text().notNull().unique(), // e.g., 'v1.0.0' for legal tracking/re-consent triggers
	title: text().notNull(),
	description: text().notNull(),
	categories: jsonb().notNull(), // Stores configurable categories (necessary, analytics, marketing, preferences)
	isActive: boolean().default(true).notNull(),
	createdAt: timestamp().defaultNow().notNull(),
	updatedAt: timestamp().defaultNow().notNull(),
});

export const userCookieConsents = snakeCase.table('user_cookie_consents', {
	id: serial().primaryKey(),
	userId: integer().references(() => users.id, { onDelete: 'cascade' }), // Nullable for anonymous public visitors
	anonymousId: text(), // Cookie/Device fingerprint for non-logged-in users
	configVersion: text().notNull(), // Links consent to the specific policy version they agreed to
	preferences: jsonb().notNull(), // e.g., { necessary: true, analytics: false, marketing: false }
	ipAddress: text(),
	userAgent: text(),
	createdAt: timestamp().defaultNow().notNull(),
	updatedAt: timestamp().defaultNow().notNull(),
});

// Compliance / Consent tracking for scalability & regulations (GDPR/SOC2)

export const userConsents = snakeCase.table('user_consents', {
	id: serial().primaryKey(),

	userId: integer()

		.notNull()

		.references(() => users.id, { onDelete: 'cascade' }),

	consentType: text().notNull(), // e.g., 'TERMS_OF_SERVICE', 'PRIVACY_POLICY', 'MARKETING'

	isGranted: boolean().notNull(),

	ipAddress: text(),

	grantedAt: timestamp().defaultNow().notNull(),
});

export const demoUsers = pgTable('demo_users', {
	id: serial('id').primaryKey(),
	name: text('name'),
	email: text('email').unique().notNull(),
	phone: text('phone').unique(),
	password: text('password'),
});
