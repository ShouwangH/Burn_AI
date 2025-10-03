import { useState } from "react";
import SceneController from "~/sceneController";

export default function Test() {
    const [scenes, setScenes] = useState([]);
    const [input, setInput] = useState('')


    async function fetchScenes(input: string) {
        const res = await fetch("/ai", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: input }),
        });

        setInterval('');

        const reader = res.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const partialStream = buffer.split("\n");
            buffer = partialStream.pop()!;

            for (const partialObject of partialStream) {
                if (!partialObject.trim()) continue;
                const payload = JSON.parse(partialObject);
                if (payload.type === "scene") {
                    setScenes((prev) => [...prev, payload.data]);

                }
            }
        }
    }

    console.log(scenes)
    return (
                <div className="bg-black h-screen">
        <div className="justify-items-center aspect-square max-w-4xl py-4">
            {scenes.length ? <SceneController scenes={scenes}/> :
                <form onSubmit={(e) => {
                    e.preventDefault()
                    setInput('')
                    fetchScenes(input)}}>
                    <input className="fixed text-center dark:bg-zinc-900 bottom-0 w-2xl max-w-4xl p-2 mb-80 border border-zinc-300 dark:border-zinc-800 rounded-xl shadow-xl text-stone-100" placeholder="What do you want to Burns?"value={input} onChange={(e) => setInput(e.target.value)} />
                </form>}
                </div>
        </div>
    );
}