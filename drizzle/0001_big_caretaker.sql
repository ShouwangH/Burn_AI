CREATE TABLE "burns_plan" (
	"id" serial PRIMARY KEY NOT NULL,
	"place" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"plan_json" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
