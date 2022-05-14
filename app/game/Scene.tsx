import * as React from "react";
import { useCanvasContext } from "./CanvasContext";

export const Scene: React.FC = () => {
    React.useEffect(() => {
        console.log("Scene Mounted");
        return () => {
            console.log("Scene Unmounted");
        };
    }, []);
    const ctx = useCanvasContext();
    React.useEffect(() => {
        // ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.beginPath();
        ctx.fillRect(225, 225, 25, 25);
        ctx.stroke();
    }, [ctx]);
    return <div>Scene</div>;
};
