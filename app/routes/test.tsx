import { useEffect, useState } from "react";
import SceneController from "~/sceneController";

export default function Test() {
    const [scenes, setScenes] = useState([]);
    const [input, setInput] = useState('')
    const [visibility, setVisibility] = useState(true)
    const [burnsPhrase, setBurnsPhrase] = useState('Loading')
    const [isFinal, setIsFinal] =useState(false)

    function reset () {
        console.log('resethome')
        setScenes([])
        setVisibility(true)
        setIsFinal(false)
    }

    useEffect(() => {
        setBurnsPhrase(loadingPhrases[Math.floor(Math.random() * loadingPhrases.length)])
        const randomPhrase = setInterval(() => setBurnsPhrase(() => loadingPhrases[Math.floor(Math.random() * loadingPhrases.length)]), 3000)
        return () => clearInterval(randomPhrase)
    }, [])


    async function fetchScenes(input: string) {
        const res = await fetch("/ai", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: input }),
        });

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
                if (payload.type ==='end') setIsFinal(true)
                if (payload.type === "scene") {
                    setScenes((prev) => [...prev, payload.data]);
                }
            }
        }
    }

    function handleVis() {
        setVisibility(!visibility)
    }

    const loadingPhrases = ["initializing sepia tone buffer…",
        "synchronizing violin resonance…",
        "allocating dramatic silence…",
        "optimizing pan-and-zoom vectors…",
        "loading melancholy at 73%…",
        "memory as fragile computation",
        "reassembling forgotten fragments…",
        "buffering the weight of absence…",
        "rendering details that refuse to stay sharp…",
        "indexing fragile recollections…",
        "restoring silence, line by line…",
        "compiling emotional resonance…",
        "buffering archival poignancy…",
        "optimizing for wistful panning speed…",
        "synchronizing voice-over gravitas…",
        "allocating dramatic pauses…"]



    const visibilityInput = visibility ? "" : " invisible "
    const inputStyle = "fixed text-center dark:bg-zinc-900 bottom-0 w-2xl max-w-4xl p-2 mb-80 border border-zinc-300 dark:border-zinc-800 rounded-xl shadow-xl text-stone-100" + visibilityInput

    return (
        <div className="bg-black h-screen">
            <div className="justify-items-center aspect-square max-w-4xl py-4">
                {scenes.length ? <SceneController scenes={scenes} isFinal={isFinal} resetHome={reset}/> :
                    <form onSubmit={(e) => {
                        e.preventDefault()
                        setInput('')
                        fetchScenes(input)
                        handleVis()
                        setIsFinal(false)
                    }}>
                        <input className={inputStyle} placeholder="What do you want to Burns?" value={input} onChange={(e) => setInput(e.target.value)} />
                    </form>}
                <p className={(visibilityInput && !scenes.length) ? "text-amber-50 ml-70 animate-pulse text-4xl mt-80 font-serif italic text-shadow-lg/30 text-shadow-amber-50" : "invisible"} >{burnsPhrase}</p>
            </div>
        </div>
    );
}