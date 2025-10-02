import { createOpenAI } from "@ai-sdk/openai";
import type { Route } from "./+types/ai";
import { generateObject, jsonSchema, streamObject, streamText, type UIMessage } from "ai";
import { documentary, makeUserPrompt, systemPlanner } from "~/lib/prompts";



const openai = createOpenAI()

export async function action({ request }: Route.ActionArgs) {
    const { place } = request.body

    console.log()

    const result = await generateObject({
        model: openai("gpt-4o-mini"),
        schema: documentary,
        prompt: makeUserPrompt('High Charity from Halo 2'),
        system: systemPlanner,
    });

    console.log(place)

    // returns SSE with the UI Message Stream protocol
    return await result.object
}