import { createOpenAI } from "@ai-sdk/openai";
import type { Route } from "./+types/image";
import { experimental_generateImage,} from 'ai'


const openai = createOpenAI();

export async function action({ request }: Route.ActionArgs) {
  const { prompt } = await request.json();

  const { images } = await experimental_generateImage({
    model: openai.image("dall-e-3"),
    prompt,
    n: 1,
    size: "1024x1024",
  });

  const image_url = `data:${images[0].mediaType};base64,${images[0].base64}`;

  return Response.json({ image_url });
}