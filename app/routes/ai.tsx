import { createOpenAI } from "@ai-sdk/openai";
import type { Route } from "./+types/ai";
import { jsonSchema, streamText, type UIMessage } from "ai";
import { documentary, makeUserPrompt, systemPlanner } from "~/lib/prompts";



const openai = createOpenAI()

export async function action({ request }: Route.ActionArgs) {
    const { place } = request.body

    const result = streamText({
        model: openai("gpt-4o-mini"),
        output: "object",
        schema: jsonSchema(documentary),
        messages: [{ role: "user", content: makeUserPrompt(place) }],
        system: systemPlanner,
    });

    // returns SSE with the UI Message Stream protocol
    return result.toUIMessageStreamResponse()
}