import { useEffect, useState } from "react";

function Player(){
    const [scenes, setScenes] = useState([])
    const [current, setCurrent] = useState(0)

    useEffect(()=>{
        (async () => {
            const res= await fetch('/ai') {method}
        })
    })
}