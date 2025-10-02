import type { Route } from "./+types/tts";
import { experimental_generateSpeech } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

const openai = createOpenAI();

export async function action({ request }: Route.ActionArgs) {
  const { text, instructions } = await request.json();

  console.log(text, instructions)

  const { audio } = await experimental_generateSpeech({
    model: openai.speech('tts-1'),
    voice: 'echo',
    text: text,
    instructions: instructions
    }
    );

  console.log( audio)

  const audio_url = `data:${audio.mediaType};base64,${audio.base64}`;

  return Response.json({ audio_url });
}
