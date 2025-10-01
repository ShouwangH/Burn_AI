import { pgTable, text, jsonb } from "drizzle-orm/pg-core"
import { user } from "./auth"


export const chat = pgTable("chat", {
    id: text("id").primaryKey(),
    user_id: text('user_chatid').references(()=>user.id),
    chat_id: text('chat_id'),
    chat_name: text('chat_name'),
    messages: jsonb('message')

})
