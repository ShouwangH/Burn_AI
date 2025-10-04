import { integer, pgTable, serial, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const scenes = pgTable("scenes", {
  id: serial("id").primaryKey(),
  doc_id: uuid('doc_id'),
  order: integer('order'),
  narration_text: text('narration_text'),
  image_prompt: text('image_prompt'),
  image_base64: text('image_base64'),
  audio_base64: text('audio_base64'),
  createdAt: timestamp("created_at").defaultNow(),

});
