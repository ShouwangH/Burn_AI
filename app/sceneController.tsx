import { useEffect, useRef, useState } from "react"
import type { Scene } from "./lib/scenes";
import SceneComp from "./scene";

interface SceneControllerProps {
    scenes: Scene[];
    isFinal: boolean
    resetHome: ()=> void
}



export default function SceneController({ scenes, isFinal, resetHome }: SceneControllerProps) {
    const songs = [
        "/audio/music1.mp3",
        "/audio/music2.mp3",
        "/audio/music3.mp3",
        "/audio/music4.mp3",
        "/audio/music5.mp3",
    ];

    const [currentIndex, setCurrentIndex] = useState(0)
    const currentScene = scenes[currentIndex];
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const stopTriggeredRef = useRef(false);

    useEffect(() => {
        if (scenes.length > 0) {
            stopTriggeredRef.current = false;
        }
    }, [scenes.length]);

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
            audio.volume = .5
        }
    }, [currentScene]);

    function handleSceneEnded() {
        setCurrentIndex((prevIndex) => {
            const nextIndex = prevIndex + 1;

            if (nextIndex >= scenes.length && isFinal) {
                stopMusicwithFade();
            }

            return nextIndex;
        });
    }

    function stopMusicwithFade() {
        if (stopTriggeredRef.current) return;
        stopTriggeredRef.current = true;

        const audio = audioRef.current;
        if (!audio) {
            resetHome();
            return;
        }

        const fadeStep = 0.05;
        const fadeInterval = 200;

        const fadeTimer = setInterval(() => {
            if (!audioRef.current) {
                clearInterval(fadeTimer);
                resetHome();
                return;
            }

            const nextVolume = Math.max(audioRef.current.volume - fadeStep, 0);
            audioRef.current.volume = Number(nextVolume.toFixed(3));

            if (nextVolume <= 0) {
                audioRef.current.pause();
                audioRef.current.src = "";
                audioRef.current = null;
                clearInterval(fadeTimer);
                resetHome();
            }
        }, fadeInterval);
    }

    useEffect(() => {
        if (isFinal && currentIndex >= scenes.length && scenes.length > 0) {
            stopMusicwithFade();
        }
    }, [isFinal, currentIndex, scenes.length]);

    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = "";
                audioRef.current = null;
                stopTriggeredRef.current = false;
            }
        };
    }, []);

    return (
        <div>
            {currentScene ? (
                <> 
                    <SceneComp
                        key={currentScene.scene_id}
                        scene={currentScene}
                        onEnded={handleSceneEnded} isFinal={isFinal} stopMusic={stopMusicwithFade}/></>)
                : null

            }
        </div>
    )

}
