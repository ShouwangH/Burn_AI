import { useEffect, useRef, useState } from "react"
import type { Scene } from "./lib/scenes";
import 'app/lib/kenburns.css'

interface SceneCompProps {
    scene: Scene;
    onEnded: () => void;
    isFinal: boolean;
    stopMusic: () => void
}


export default function SceneComp({ scene, onEnded, isFinal, stopMusic }: SceneCompProps) {
    const [randomAnim, setRandomAnim] = useState(pickRandomAnimation())

    function pickRandomAnimation(): string {
        const directions = [
            "preset-up",
            "preset-down",
            "preset-left",
            "preset-right",
            "preset-center",
        ];

        const zooms = [
            "zoom-in-soft",
            "zoom-in",
            "zoom-in-strong",
            "zoom-out-soft",
            "zoom-out",
            "zoom-out-strong",
        ];

        const durations = ["duration-fast", "duration-med", "duration-slow"];

        const easings = ["ease-linear", "ease-smooth", "ease-drama"];

        function rand(arr: string[]): string {
            return arr[Math.floor(Math.random() * arr.length)]
        }
        return `kenburns ${rand(directions)} ${rand(zooms)} ${rand(durations)} ${rand(easings)}`
    }

    console.log(isFinal)


    useEffect(() => {
        const sceneAudio = new Audio(scene.audio_url)
        sceneAudio.play()

        sceneAudio.onended = (() => {
            onEnded()
        /*if (isFinal) {
            stopMusic()}*/
        })

        return () => {
            sceneAudio.pause();
            sceneAudio.onended = null;
        };
    }, [scene]);

    return (
        <div className="frame">
            <img src={scene.image_url} alt={scene.title} className={randomAnim} />
        </div>
    );
}