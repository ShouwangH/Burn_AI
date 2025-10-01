import 'dotenv/config'
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres'
import { chat } from './schema/chat';
import { eq } from 'drizzle-orm';



const client = postgres(process.env.DATABASE_URL!)
export const db = drizzle({client})

export async function getChats() {
    const allChats = await db.select().from(chat)
    return allChats.map(chat=>chat.id)
}

export async function getCurrentChat(chatId:string) {
    const currentChat = await db.select().from(chat).where(eq(chat.chat_id,chatId))
    return currentChat[0]
}


export async function setChat(newChat) {
    await db.insert(chat).values(newChat).onConflictDoUpdate({target:chat.id, set{messages:newChat.messages}})
}

