import { createOpenAI } from "@ai-sdk/openai";
import type { Route } from "./+types/ai";
import { experimental_generateImage, streamObject} from "ai";
import { makeUserPrompt, sceneSchema, systemPlanner } from "~/lib/prompts";


const openai = createOpenAI()

export async function action({ request }: Route.ActionArgs) {
  const { place } = await request.json();

  const { images } = await experimental_generateImage({
    model: openai.image("dall-e-3"),
    prompt: `${place}`,
    n: 1,
    size: "1024x1024",
  });

  return Response.json({
    images: images.map(img => ({
      image_url: `data:${img.mediaType};base64,${img.base64}`,
    })),
  });
}


    /*const result = streamObject({
    model: openai("gpt-4o-mini"),
    output: "array",          // 👈 important: tell it the root is an array
    schema: sceneSchema,      // schema applies to each array element
    system: systemPlanner,
    prompt: makeUserPrompt(place),
  });

  for await (const scene of result.elementStream) {
    console.log("---- scene complete ----");
    console.log("id:", scene.scene_id);
    console.log("title:", scene.title);
    console.log("year/place:", scene.year, scene.place);
    console.log("narration:", scene.narration_text);
    console.log("image prompt:", scene.image_prompt);
    console.log("music mood:", scene.music_mood);
    console.log("------------------------");
  }
  // just end cleanly
  return new Response("ok");*/





