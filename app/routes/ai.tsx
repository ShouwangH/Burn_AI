import { createOpenAI } from "@ai-sdk/openai";
import type { Route } from "./+types/ai";
import { experimental_generateImage, experimental_generateSpeech, streamObject } from "ai";
import { makeUserPrompt, sceneSchema, systemPlanner } from "~/lib/prompts";
import { insertScenes } from "~/src/db/db";
import { performance } from "node:perf_hooks";


const openai = createOpenAI()

function sanitizeImagePrompt(prompt: string): string {
    return prompt
        .replace(/\r\n|\n|\r/g, " ")
        .replace(/\s+/g, " ")
        .replace(/[“”]/g, '"')
        .replace(/[’‘]/g, "'")
        .trim();
}

async function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildImagePrompt(scene: {
    image_prompt: string;
    title?: string;
    place?: string;
    narration_text?: string;
}): string {
    const cleanedPrompt = sanitizeImagePrompt(scene.image_prompt);
    const subject = sanitizeImagePrompt(scene.title ?? scene.place ?? "the central figure");
    const focusInstruction = `Center focal point: ${subject}. Maintain crisp focus on this subject with shallow depth-of-field.`;
    const compositionHints =
        "Archival sepia photograph, 4:3 aspect, medium format camera, gentle film grain, soft directional lighting, no text, no modern artifacts.";
    const framingHint =
        "Compose with balanced foreground and background elements, ensuring leading lines guide toward the focal subject.";
    const narrationSnippet = scene.narration_text
        ? sanitizeImagePrompt(scene.narration_text.split(/\s+/).slice(0, 18).join(" "))
        : "";
    const moodHint = narrationSnippet
        ? `Narration tone reference: ${narrationSnippet}. Preserve quiet, archival atmosphere.`
        : "";

    return [cleanedPrompt, focusInstruction, compositionHints, framingHint, moodHint]
        .filter(Boolean)
        .join(" ");
}

type AttemptCallback = (details: {
    attempt: number;
    durationMs: number;
    success: boolean | null;
    status: "start" | "end";
    reason?: "success" | "timeout" | "error";
}) => void;

const IMAGE_TIMEOUT_MS = 20_000;

async function generateImageWithRetry(rawPrompt: string, onAttempt?: AttemptCallback, maxAttempts = 3) {
    const prompt = sanitizeImagePrompt(rawPrompt);
    let lastError: unknown = null;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        const attemptStart = performance.now();
        onAttempt?.({ attempt, durationMs: 0, success: null, status: "start" });
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), IMAGE_TIMEOUT_MS);
        try {
            const { image } = await experimental_generateImage({
                model: openai.image("dall-e-2"),
                prompt,
                n: 1,
                size: "256x256",
                maxRetries: 0,
                signal: controller.signal
            });

            const durationMs = Math.round(performance.now() - attemptStart);
            onAttempt?.({
                attempt,
                durationMs,
                success: true,
                status: "end",
                reason: "success"
            });

            const imageUrl = `data:${image.mediaType};base64,${image.base64}`;
            return { imageUrl, prompt, failed: false as const, attempts: attempt };
        } catch (error) {
            const durationMs = Math.round(performance.now() - attemptStart);
            const reason = controller.signal.aborted ? "timeout" : "error";
            const normalizedError =
                reason === "timeout"
                    ? new Error(`Image generation timed out after ${IMAGE_TIMEOUT_MS}ms`)
                    : error;
            onAttempt?.({
                attempt,
                durationMs,
                success: false,
                status: "end",
                reason
            });
            lastError = normalizedError;
            if (attempt < maxAttempts) {
                await sleep(400 * attempt);
            }
        } finally {
            clearTimeout(timeoutId);
        }
    }

    return { imageUrl: null, prompt, failed: true as const, attempts: maxAttempts, error: lastError };
}

export async function action({ request }: Route.ActionArgs) {
    const { prompt } = await request.json();

    const result = streamObject({
        model: openai("gpt-4o-mini"),
        output: "array",
        schema: sceneSchema,
        system: systemPlanner,
        prompt: makeUserPrompt(prompt),
    });

    const docId = crypto.randomUUID()

    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder()
            let order = 1
            let totalImageAttempts = 0

            for await (const scene of result.elementStream) {
                const preparedImagePrompt = buildImagePrompt(scene);
                const imageResult = await generateImageWithRetry(preparedImagePrompt, ({ attempt, durationMs, success, status }) => {
                    if (status === "start") {
                        totalImageAttempts += 1;
                    }
                    const retryPayload = JSON.stringify({
                        type: "retry",
                        data: {
                            totalAttempts: totalImageAttempts,
                            attempt,
                            durationMs,
                            success,
                            status,
                            scene_id: scene.scene_id,
                            order
                        }
                    }) + "\n";
                    controller.enqueue(encoder.encode(retryPayload));
                });

                const { audio } = await experimental_generateSpeech({
                    model: openai.speech("gpt-4o-mini-tts"),
                    voice: 'onyx',
                    text: scene.narration_text

                    }
                );

                const audio_url = `data:${audio.mediaType};base64,${audio.base64}`;

                insertScenes(docId,order, scene.narration_text,imageResult.prompt,imageResult.imageUrl ?? null,audio_url)

                const enrichedScene = {
                    ...scene,
                    audio_url: audio_url,
                    image_url: imageResult.imageUrl,
                    image_generation_status: imageResult.failed ? "failed" : "ok",
                    image_prompt: imageResult.prompt,
                    image_attempts: imageResult.attempts
                }

                order += 1

                const streamPayload = JSON.stringify({ type: "scene", data: enrichedScene }) + "\n"
                controller.enqueue(encoder.encode(streamPayload))
            }
            controller.enqueue(encoder.encode(JSON.stringify({ type: "end" }) + "\n"));
            controller.close()
        }
    })

    return new Response(stream, { headers: { 'content-type': 'application/x-ndjson' } })

}
