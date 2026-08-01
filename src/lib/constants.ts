// Brand, Social, and Profile Constants for Oluwaleke Abiodun (a_short_dev)

export const OWNER_INFO = {
	name: 'Oluwaleke Abiodun',
	shortName: 'Leke',
	brand: 'a_short_dev',
	title: 'Polyglot Engineer & Founder',
	tagline: 'Performance • Low Memory • Security',
	phone: '+2349165913234',
	phoneFormatted: '+234 916 591 3234',
	email: 'lakessyde@gmail.com',
};

export const SOCIAL_LINKS = {
	github: 'https://github.com/a-short-dev',
	linkedin: 'https://www.linkedin.com/in/ashortdev/',
	twitter: 'https://x.com/a_short_dev',
	substack: 'https://devweaver.substack.com',
	whatsapp: `https://wa.me/${OWNER_INFO.phone}`,
};

export const DOMAINS = {
	canonical: 'https://oluwaleke.dev',
	vercel: 'https://oluwaleke-dev.vercel.app',
};

export const MAX_ACTIVE_DEVICES = 5;
export const MAX_ACTIVE_SESSIONS = 5;

export const GLOBAL_RESERVED_ROLES = [
	'plaform-super-admin',
	'platform-admin',
	'support-agent',
] as const;

export const TENANT_DEFAULT_ROLES = ['super-admin', 'admin', 'staff'] as const;

export const SESSION_POLICIES = {
	MAX_DEVICES: MAX_ACTIVE_DEVICES,
	MAX_SESSIONS: MAX_ACTIVE_SESSIONS,
	TOKEN_EXPIRY_DAYS: 7,
	RESERVED_ROLES: GLOBAL_RESERVED_ROLES && TENANT_DEFAULT_ROLES,
} as const;

export const AUDIT_ACTIONS = {
	USER_CREATED: 'USER_CREATED',
	USER_DELETED: 'USER_DELETED',
	ROLE_ASSIGNED: 'ROLE_ASSIGNED',
	SESSION_CREATED: 'SESSION_CREATED',
	SESSION_REVOKED: 'SESSION_REVOKED',
} as const;

export const VERIFICATION_TYPES = {
	EMAIL_VERIFICATION: 'EMAIL_VERIFICATION',
	PASSWORD_RESET: 'PASSWORD_RESET',
	TWO_FACTOR: 'TWO_FACTOR',
} as const;
