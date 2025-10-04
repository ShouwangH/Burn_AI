ALTER TABLE "burns_plan" RENAME TO "scenes";--> statement-breakpoint
ALTER TABLE "scenes" ADD COLUMN "doc_id" uuid;--> statement-breakpoint
ALTER TABLE "scenes" ADD COLUMN "order" integer;--> statement-breakpoint
ALTER TABLE "scenes" ADD COLUMN "narration_text" text;--> statement-breakpoint
ALTER TABLE "scenes" ADD COLUMN "image_prompt" text;--> statement-breakpoint
ALTER TABLE "scenes" ADD COLUMN "image_base64" text;--> statement-breakpoint
ALTER TABLE "scenes" ADD COLUMN "audio_base64" text;--> statement-breakpoint
ALTER TABLE "scenes" DROP COLUMN "place";--> statement-breakpoint
ALTER TABLE "scenes" DROP COLUMN "status";--> statement-breakpoint
ALTER TABLE "scenes" DROP COLUMN "plan_json";--> statement-breakpoint
ALTER TABLE "scenes" DROP COLUMN "updated_at";