import { useEffect, useState } from "react";




export default function MusicPlayer() {
    const [current, setCurrent] = useState<string | null>(null);

    const songs = [
        "/audio/music1.mp3",
        "/audio/music2.mp3",
        "/audio/music3.mp3",
        "/audio/music4.mp3",
        "/audio/music5.mp3",
    ];

    useEffect(() => {
        const pick = songs[Math.floor(Math.random() * songs.length)];
        setCurrent(pick);
        console.log(pick)
    }, []);

    return null

        ;
}
