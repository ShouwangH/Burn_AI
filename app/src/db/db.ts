import { drizzle } from "drizzle-orm/postgres-js";
import postgres from 'postgres'
import { scenes } from "./schema/burns";
import { eq } from "drizzle-orm";
import type { UUID } from "crypto";

const client = postgres(process.env.DATABASE_URL!)
export const db = drizzle({ client });

export async function insertScenes(doc_id:UUID, order:number, narration_text:string,image_prompt:string, image_base64:string,
  audio_base64:string) {
   await db
    .insert(scenes)
    .values({doc_id:doc_id, order:order, narration_text:narration_text,image_prompt:image_prompt,image_base64:image_base64,
      audio_base64:audio_base64
     })
}

export async function getScenes(doc_id:UUID) {
  return db
    .select()
    .from(scenes)
    .where(eq(scenes.doc_id,doc_id))
    .limit(1);
}
