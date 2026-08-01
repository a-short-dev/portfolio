CREATE TABLE "demo_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"phone" text,
	"password" text,
	CONSTRAINT "demo_users_email_unique" UNIQUE("email"),
	CONSTRAINT "demo_users_phone_unique" UNIQUE("phone")
);
