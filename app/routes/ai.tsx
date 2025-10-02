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
                    model: openai.image("dall-e-3"),
                    prompt: scene.image_prompt,
                    n: 1,
                    size: "1024x1024",
                });

                const image_url = `data:${image.mediaType};base64,${image.base64}`;

                const { audio } = await experimental_generateSpeech({
                    model: openai.speech('tts-1'),
                    voice: 'onyx',
                    text: scene.narration_text,
                    instructions: `tone:
measured, archival, almost judicial. it sounds like someone reading from a historical record with respect, not performance. no dramatics, no peaks or valleys.

pacing:
slow to moderate, about 120–140 words per minute. enough space that each word lands. never rushed.

emotion:
restrained but heavy with implication. the narrator doesn’t cry, but the weight of loss, endurance, or memory is present in the timbre.

emphasis:
placed on nouns and verbs, not adjectives. “they endured the winter.” “a single letter was carried across the front.” adjectives are downplayed, almost parenthetical.

pronunciation:
clear, standard american english, slightly formal, no regionalisms. consonants softened but distinct. vowels elongated just enough to feel deliberate.

pauses:
regular, deliberate pauses after each complete thought. often a short beat between sentence one (detail) and sentence two (expansion), then a slightly longer pause before the reflective close. silence is part of the rhythm.`
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
            controller.close()
        }
    })

    return new Response(stream, { headers: { 'content-type': 'application/x-ndjson' } })

}



