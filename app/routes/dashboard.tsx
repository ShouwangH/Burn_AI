import { createOpenAI } from '@ai-sdk/openai';
import { useState } from 'react';
import { Form } from 'react-router';
import type { Route } from './+types/dashboard';
import { generateObject, jsonSchema} from 'ai'



export function Dashboard() {
    const [input, setInput] = useState('');


    return (
        <div className="w-full h-screen flex flex-col justify-evenly items-center bg-black">

            <Form method="POST"
                action='/plan'
            >
                <input
                    className=" dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-xl shadow-xl text-stone-100"
                    value={input}
                    name="place"
                    placeholder="Say something..."
                    onChange={e => setInput(e.currentTarget.value)}
                />
            </Form>
        </div>
    )
}

