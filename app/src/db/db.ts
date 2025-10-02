import { drizzle } from "drizzle-orm/postgres-js";
import postgres from 'postgres'
import { burnsPlan } from "./schema/burns";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL!)
export const db = drizzle({ client });

export async function addPlan(place: string) {
  console.log('insert')
  const [job] = await db
    .insert(burnsPlan)
    .values({ place, status: "pending" })
    .returning();
  return job;
}

export async function updatePlan(id: number, planJson: object) {
  await db
    .update(burnsPlan)
    .set({ planJson, status: "ready", updatedAt: new Date() })
    .where(eq(burnsPlan.id,id));
}

export async function getPlan(place: string) {
  return db
    .select()
    .from(burnsPlan)
    .where(eq(burnsPlan.place,place))
    .limit(1);
}
