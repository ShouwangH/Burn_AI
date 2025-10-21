import { useEffect, useState } from "react";
import SceneController from "~/sceneController";
import {auth} from "../src/lib/auth.server"
import { redirect } from "react-router";
import type { Scene } from "~/lib/scenes";

export async function loader({ request }: LoaderFunctionArgs) {
    const session = await auth.api.getSession({ headers: request.headers })
    if (session?.user) {
        return { user: session.user }
    } else {
        throw redirect("/")
    }
}

export default function Test() {
    const [scenes, setScenes] = useState<Scene[]>([]);
    const [input, setInput] = useState('')
    const [visibility, setVisibility] = useState(true)
    const [burnsPhrase, setBurnsPhrase] = useState('Loading')
    const [isFinal, setIsFinal] =useState(false)
    const [retryCount, setRetryCount] = useState(0)
    const [lastAttemptMs, setLastAttemptMs] = useState(0)
    const [attemptStart, setAttemptStart] = useState<number | null>(null)

    function reset () {
        console.log('resethome')
        setScenes([])
        setVisibility(true)
        setIsFinal(false)
        setRetryCount(0)
        setLastAttemptMs(0)
        setAttemptStart(null)
    }

    useEffect(() => {
        setBurnsPhrase(loadingPhrases[Math.floor(Math.random() * loadingPhrases.length)])
        const randomPhrase = setInterval(() => setBurnsPhrase(() => loadingPhrases[Math.floor(Math.random() * loadingPhrases.length)]), 3000)
        return () => clearInterval(randomPhrase)
    }, [])


    async function fetchScenes(input: string) {
        setRetryCount(0)
        setLastAttemptMs(0)
        setAttemptStart(null)
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
                if (payload.type === "retry" && payload.data?.totalAttempts !== undefined) {
                    console.info("[burns] image attempt", payload.data);
                    if (payload.data.status === "start") {
                        setRetryCount(payload.data.totalAttempts);
                        setLastAttemptMs(0);
                        if (typeof window !== "undefined" && typeof window.performance !== "undefined") {
                            setAttemptStart(window.performance.now());
                        } else {
                            setAttemptStart(Date.now());
                        }
                    } else {
                        if (typeof payload.data.durationMs === "number") {
                            setLastAttemptMs(payload.data.durationMs);
                        }
                        if (payload.data.totalAttempts) {
                            setRetryCount(payload.data.totalAttempts);
                        }
                        setAttemptStart(null);
                    }
                    continue;
                }
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



    const inputStyle = "w-full max-w-3xl rounded-xl border border-zinc-300 p-4 text-center text-lg text-stone-100 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 placeholder:text-stone-500"
    const inputClassName = `${inputStyle}${visibility ? "" : " invisible"}`.trim();
    const showRetryCounter = !scenes.length && !visibility;

    return (
        <div className="relative flex min-h-screen flex-col bg-black text-amber-50">
            {showRetryCounter ? (
                <div className="pointer-events-none absolute right-6 top-6 rounded-md bg-black/70 px-4 py-2 text-sm font-semibold tracking-wide text-amber-200">
                    <div>{retryCount}</div>
                    <div>{lastAttemptMs}</div>
                </div>
            ) : null}
            <div className="flex flex-1 flex-col items-center justify-center">
                {scenes.length ? <SceneController scenes={scenes} isFinal={isFinal} resetHome={reset}/> :
                    <form className="flex w-full flex-col items-center gap-6 px-6" onSubmit={(e) => {
                        e.preventDefault()
                        setInput('')
                        fetchScenes(input)
                        handleVis()
                        setIsFinal(false)
                    }}>
                        <input className={inputClassName} placeholder="What do you want to Burns?" value={input} onChange={(e) => setInput(e.target.value)} />
                        <p className={(!visibility && !scenes.length) ? "animate-pulse text-2xl font-serif italic text-amber-50/90" : "invisible"} >{burnsPhrase}</p>
                    </form>}
            </div>
        </div>
    );
}
