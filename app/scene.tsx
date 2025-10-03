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

    // build keyframes css string
    const frames = camera.keyframes
        .map((kf: any) => {
            const t = `scale3d(${kf.scale *3.5 },${kf.scale*3.5},1) translate3d(${kf.x}px,${kf.y}px,0)`;
            const opacity = kf.opacity !== undefined ? `opacity:${kf.opacity};` : "";
            return `${kf.percent}% { transform:${t}; ${opacity} }`;
        })
        .join("\n");

    const rule = `@keyframes ${animName} { ${frames} }`;


    // insert rule into stylesheet
    sheet.insertRule(rule, sheet.cssRules.length);


    // return classname with animation attached
    const className = `kenburns-${sceneId}`;
    const animRule = `.${className} { animation:${animName} ${duration*2000}ms forwards; transform-origin:center center; }`;
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
        <div className="justify-items-center p-96 ml-120 overflow-hidden aspect-square h-screen w-screen">
            <img src={scene.image_url} alt={scene.title} className={animClass} />
        </div>
    );
}