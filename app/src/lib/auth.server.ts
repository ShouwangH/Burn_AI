import { betterAuth } from "better-auth"

export const auth = betterAuth({
    database: {
        provider: "pg",
        url: process.env.DATABASE_URL,
    }
})