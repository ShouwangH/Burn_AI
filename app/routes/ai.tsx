import { createOpenAI } from "@ai-sdk/openai";
import type { Route } from "./+types/ai";
import { experimental_generateImage, experimental_generateSpeech, streamObject } from "ai";
import { makeUserPrompt, sceneSchema, systemPlanner } from "~/lib/prompts";


const openai = createOpenAI()

export async function action({ request }: Route.ActionArgs) {
    const { place } = await request.json();

    const result = streamObject({
        model: openai("gpt-4o-mini"),
        output: "array",
        schema: sceneSchema,
        system: systemPlanner,
        prompt: makeUserPrompt(place),
    });

    const stream = new ReadableStream ({
        async start(controller) {
            const encoder = new TextEncoder()

    for await (const scene of result.elementStream) {

        const { image } = await experimental_generateImage({
            model: openai.image("gpt-4o-2024-08-06"),
            prompt: scene.image_prompt,
            n: 1,
            size: "1024x1024",
        });

        const image_url = `data:${image.mediaType};base64,${image.base64}`;

        const { audio } = await experimental_generateSpeech({
            model: openai.speech('tts-1'),
            voice: 'echo',
            text: scene.narration_text,
            instructions: 'Speak in a calm, archival documentary tone.'
        }
        );

        const audio_url = `data:${audio.mediaType};base64,${audio.base64}`;

        const enricheScene = {
            ...scene,
            audio_url: audio_url,
            image_url: image_url
        }

        const streamPayload = JSON.stringify({ type:"scene", data: enricheScene}) + "\n"
    }
    controller.close()}})

    return new Response(stream, {headers: {'Content-type':'application/x-ndjson'}})

}



