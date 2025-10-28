import { useEffect, useMemo } from "react"
import type { Scene } from "./lib/scenes";
import 'app/lib/kenburns.css'

interface SceneCompProps {
    scene: Scene;
    onEnded: () => void;
    isFinal: boolean;
    stopMusic: () => void
}


export default function SceneComp({ scene, onEnded, isFinal: _isFinal, stopMusic: _stopMusic }: SceneCompProps) {
    const animationClass = useMemo(
        () => buildAnimationClass(scene),
        [scene.scene_id, scene.image_prompt, scene.narration_text]
    );

    useEffect(() => {
        if (scene.image_prompt) {
            console.info("[burns] scene prompt", scene.scene_id, scene.image_prompt);
        }
        const sceneAudio = new Audio(scene.audio_url);
        sceneAudio.play().catch((error) => console.warn("narration play failed", error));

        sceneAudio.onended = () => {
            onEnded();
        };

        return () => {
            sceneAudio.pause();
            sceneAudio.onended = null;
            sceneAudio.src = "";
        };
    }, [scene]);

    return (
        <div className="frame">
            <div className="relative flex h-full w-full items-center justify-center">
                {scene.image_url ? (
                    <img src={scene.image_url} alt={scene.title} className={animationClass} />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-black/80 text-center text-lg font-semibold uppercase tracking-wide text-amber-200">
                        could not generate image
                    </div>
                )}
            </div>
        </div>
    );
}

function buildAnimationClass(scene: Scene): string {
    const prompt = scene.image_prompt?.toLowerCase() ?? "";
    const direction = pickDirection(prompt);
    const zoom = pickZoom(prompt);
    const duration = pickDuration(scene.narration_text);
    const easing = pickEasing(prompt);
    return `kenburns ${direction} ${zoom} ${duration} ${easing}`;
}

function pickDirection(prompt: string): string {
    if (prompt.includes("left side") || prompt.includes("left-hand") || prompt.includes("stage left")) {
        return "preset-right";
    }
    if (prompt.includes("right side") || prompt.includes("right-hand") || prompt.includes("stage right")) {
        return "preset-left";
    }
    if (prompt.includes("looking up") || prompt.includes("sky") || prompt.includes("towering")) {
        return "preset-up";
    }
    if (prompt.includes("ground") || prompt.includes("floor") || prompt.includes("soil") || prompt.includes("cobblestone")) {
        return "preset-down";
    }
    return "preset-center";
}

function pickZoom(prompt: string): string {
    if (prompt.includes("crowd") || prompt.includes("panorama") || prompt.includes("wide shot") || prompt.includes("landscape")) {
        return "zoom-out";
    }
    if (prompt.includes("close-up") || prompt.includes("portrait") || prompt.includes("solo") || prompt.includes("detail")) {
        return "zoom-in";
    }
    if (prompt.includes("macro") || prompt.includes("tight framing") || prompt.includes("intimate")) {
        return "zoom-in-strong";
    }
    if (prompt.includes("distant") || prompt.includes("aerial") || prompt.includes("bird's-eye")) {
        return "zoom-out-strong";
    }
    return "zoom-in-soft";
}

function pickDuration(narration: string): string {
    const wordCount = narration.split(/\s+/).filter(Boolean).length;
    if (wordCount <= 30) {
        return "duration-fast";
    }
    if (wordCount <= 38) {
        return "duration-med";
    }
    return "duration-slow";
}

function pickEasing(prompt: string): string {
    if (prompt.includes("somber") || prompt.includes("solemn") || prompt.includes("quiet")) {
        return "ease-drama";
    }
    if (prompt.includes("steady") || prompt.includes("calm") || prompt.includes("gentle")) {
        return "ease-smooth";
    }
    return "ease-linear";
}
