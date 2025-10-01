import { createOpenAI} from '@ai-sdk/openai';
import { streamText, type UIMessage, convertToModelMessages } from 'ai';
import type { Route } from './+types/chat';



export const maxDuration = 30;

const openai = createOpenAI()

export async function action({ request }: Route.ActionArgs) {
    const { messages }: { messages: UIMessage[] } = await request.json()

    

    const result = streamText({
        model: openai('gpt-4'),
        messages: convertToModelMessages(messages)
    })

return result.toUIMessageStreamResponse({
    originalMessages: messages, // pass this in for type-safe return objects
    messageMetadata: ({ part }) => {
      // Send metadata when streaming starts
      if (part.type === 'start') {
        return {
          createdAt: Date.now(),
          model: 'gpt-4o',
        };
      }

      // Send additional metadata when streaming completes
      if (part.type === 'finish') {
        return {
          totalTokens: part.totalUsage.totalTokens,
        };
      }
    },
  });
}
