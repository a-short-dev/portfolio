CREATE TABLE "projects" (
	"id" serial PRIMARY KEY,
	"project_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE UNIQUE INDEX "unique_platform_super_admin" ON "user_roles" ("role_id") WHERE "role_id" = 1;