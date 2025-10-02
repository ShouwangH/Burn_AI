import {  useState } from "react"
import type { Scene } from "./lib/scenes";
import SceneComp from "./scene";

interface SceneControllerProps {
    scenes: Scene[];
}

export default function SceneController({ scenes }: SceneControllerProps) {

    const [currentIndex, setCurrentIndex] = useState(0)

    function handleSceneEnded() {
        console.log( currentIndex)
            setCurrentIndex(currentIndex + 1)

            console.log(currentIndex)
            console.log(scenes.length)
    }
    const currentScene = scenes[currentIndex];

    return (
        <div>
             { currentScene ? (<SceneComp
                    key={currentScene.scene_id}
                    scene={currentScene}
                    onEnded={handleSceneEnded}/>)
                :
                <p>Loading Scenes</p>
                }
        </div>
    )

}