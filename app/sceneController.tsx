import { useEffect, useRef, useState } from "react"
import type { Scene } from "./lib/scenes";
import SceneComp from "./scene";
import MusicPlayer from "./musicPlayer";

interface SceneControllerProps {
    scenes: Scene[];
}



export default function SceneController({ scenes }: SceneControllerProps) {
    const songs = [
        "/audio/music1.mp3",
        "/audio/music2.mp3",
        "/audio/music3.mp3",
        "/audio/music4.mp3",
        "/audio/music5.mp3",
    ];

    const [currentIndex, setCurrentIndex] = useState(0)
    const currentScene = scenes[currentIndex];
    const audioRef = useRef(null);

    useEffect(() => {
        if (!currentScene) return;

        if (!audioRef.current) {
            const audio = new Audio();
            audioRef.current = audio;

            const pick = songs[Math.floor(Math.random() * songs.length)];
            audio.src = pick;

            audio.onended = () => {
                const next = songs[Math.floor(Math.random() * songs.length)];
                audio.src = next;
                audio.play().catch((err) => console.warn("play failed", err));
            };

            audio.play().catch((err) => console.warn("autoplay blocked", err));
        }
    }, [currentScene]);

    function handleSceneEnded() {
        setCurrentIndex(currentIndex + 1)
    }


    return (
        <div>

            {currentScene ? (
                <> 
                    <SceneComp
                        key={currentScene.scene_id}
                        scene={currentScene}
                        onEnded={handleSceneEnded} /></>)
                : null

            }
        </div>
    )

}