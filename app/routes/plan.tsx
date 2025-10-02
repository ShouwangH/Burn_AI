import { createOpenAI } from '@ai-sdk/openai';
import { generateObject, jsonSchema } from 'ai';
import type { Route } from './+types/plan';
import { documentary, makeUserPrompt, systemPlanner } from '~/lib/prompts';
import { addPlan, updatePlan } from '~/src/db/db';
import { redirect } from 'react-router';



const openai = createOpenAI()


export async function action({ request }:Route.ActionArgs) {
    const formData = await request.formData()
    const place = formData.get('place') as string

    const burnsPlan = await addPlan(place)

      void (async () => {
    try {
      const { object } = await generateObject({
        model: openai("gpt-4o-mini"),
        output: "object",
        schema: jsonSchema(documentary),
        messages: [{ role: "user", content: makeUserPrompt(place) }],
        system: systemPlanner,
      });

      // Update DB with result
      await updatePlan(burnsPlan.id, object);
    } catch (err) {
      console.error("AI generation failed:", err);
      await updatePlan(burnsPlan.id, { error: "AI failed" });
    }
  })();

  // Redirect immediately
  return redirect(`/burns/${place}`);
}




