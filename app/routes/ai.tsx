import { createOpenAI } from "@ai-sdk/openai";
import type { Route } from "./+types/ai";
import { experimental_generateImage, experimental_generateSpeech, streamObject } from "ai";
import { makeUserPrompt, sceneSchema, systemPlanner } from "~/lib/prompts";


const openai = createOpenAI()

export async function action({ request }: Route.ActionArgs) {
    const { prompt } = await request.json();

    const result = streamObject({
        model: openai("gpt-4o-mini"),
        output: "array",
        schema: sceneSchema,
        system: systemPlanner,
        prompt: makeUserPrompt(prompt),
    });

    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder()

            for await (const scene of result.elementStream) {

               const { image } = await experimental_generateImage({
                    model: openai.image("dall-e-2"),
                    prompt: scene.image_prompt,
                    n: 1,
                    size: "256x256",
                });

                const image_url = `data:${image.mediaType};base64,${image.base64}`;

                const { audio } = await experimental_generateSpeech({
                    model: openai.speech("gpt-4o-mini-tts"),
                    voice: 'onyx',
                    text: scene.narration_text
                    }
                );

                const audio_url = `data:${audio.mediaType};base64,${audio.base64}`;

                const enrichedScene = {
                    ...scene,
                    audio_url: audio_url,
                    image_url: image_url
                }

                const streamPayload = JSON.stringify({ type: "scene", data: enrichedScene }) + "\n"
                controller.enqueue(encoder.encode(streamPayload))
            }
            controller.enqueue(encoder.encode(JSON.stringify({ type: "end" }) + "\n"));
            controller.close()
        }
    })

    return new Response(stream, { headers: { 'content-type': 'application/x-ndjson' } })

}



