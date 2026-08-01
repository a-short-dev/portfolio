CREATE TABLE "cookie_consent_configs" (
	"id" serial PRIMARY KEY,
	"version" text NOT NULL UNIQUE,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"categories" jsonb NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_cookie_consents" (
	"id" serial PRIMARY KEY,
	"user_id" integer,
	"anonymous_id" text,
	"config_version" text NOT NULL,
	"preferences" jsonb NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_cookie_consents" ADD CONSTRAINT "user_cookie_consents_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;