import { useEffect, useRef, useState } from "react"
import type { Scene } from "./lib/scenes";
import React from "react";

interface SceneCompProps {
    scene: Scene;
    onEnded: () => void;
}

let styleSheet: HTMLStyleElement | null = null;

function ensureStyleSheet() {
    if (!styleSheet) {
        styleSheet = document.createElement("style");
        document.head.appendChild(styleSheet);
    }
    console.log('stylsheet')
    return styleSheet.sheet as CSSStyleSheet;
}

export function createKenBurnsClass(sceneId: string, camera: any, duration: number) {
    const sheet = ensureStyleSheet();
    const animName = `kenburns-${sceneId}`;

    console.log('create KenBurns')

    // build keyframes css string
    const frames = camera.keyframes
        .map((kf: any) => {
            const t = `scale3d(${kf.scale},${kf.scale},1) translate3d(${kf.x}px,${kf.y}px,0)`;
            const opacity = kf.opacity !== undefined ? `opacity:${kf.opacity};` : "";
            return `${kf.percent}% { transform:${t}; ${opacity} }`;
        })
        .join("\n");

    const rule = `@keyframes ${animName} { ${frames} }`;

    console.log(rule)

    // insert rule into stylesheet
    sheet.insertRule(rule, sheet.cssRules.length);

    console.log(sheet)

    // return classname with animation attached
    const className = `scale-500 kenburns-${sceneId}`;
    const animRule = `.${className} { animation:${animName} 2000ms forwards; transform-origin:center center; }`;
    sheet.insertRule(animRule, sheet.cssRules.length);

    console.log(sheet)

    return className;
}



export default function SceneComp({ scene, onEnded }: SceneCompProps) {
    const [animClass, setAnimClass] = useState("");
 

    useEffect(() => {
        const sceneAudio = new Audio(scene.audio_url)
        sceneAudio.play()

        sceneAudio.onended = (() => {
            onEnded()
        })

        const cls = createKenBurnsClass(scene.scene_id, scene.camera, scene.duration_s);
        setAnimClass(cls);

        return () => {
            sceneAudio.pause();
            sceneAudio.onended = null;
        };
    }, [scene]);

    return (
        <div className="overflow-hidden aspect-square w-screen h-screen justify-center">
            <img src={scene.image_url} alt={scene.title} className={animClass} />
        </div>
    );
}