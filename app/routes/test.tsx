import { useEffect, useRef, useState } from "react";
import SceneController from "~/sceneController";

export default function Test() {
    const [scenes, setScenes] = useState<any[]>([]);
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
    return (
        <div>
            <SceneController scenes={scenes}/>
                <div>
                    <input value={input} onChange={(e) => setInput(e.target.value)} />
                    <button onClick={() => fetchScenes(input)}>Generate</button>
                </div>
        </div>
    );
}