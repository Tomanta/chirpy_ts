CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updatd_at" timestamp DEFAULT now() NOT NULL,
	"email" varchar(256) NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
