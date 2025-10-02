import { useEffect } from "react"
import type { Scene } from "./lib/scenes";
import React from "react";

interface SceneCompProps {
    scene: Scene;
    onEnded: () => void;
}


export default function SceneComp({ scene, onEnded }: SceneCompProps) {

    useEffect(() => {
        const sceneAudio = new Audio(scene.audio_url)
        sceneAudio.play()

        sceneAudio.onended = (() => {
            onEnded()
        })

        return ()=> {
            sceneAudio.pause();
            sceneAudio.onended = null
        }
        
    }, [])


    return (
     <div key={scene.scene_id}>
            <h2>{scene.title} ({scene.year})</h2>
            <img src={scene.image_url} alt={scene.title} className="max-w-md" />
        </div>
    )
}
