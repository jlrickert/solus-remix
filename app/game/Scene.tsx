import * as React from "react";
import { useCanvasContext } from "./CanvasContext";

export type SceneProps = Readonly<{}>;

const Box: React.FC<{
    x: number;
    y: number;
}> = React.memo((props) => {
    const ctx = useCanvasContext();

    React.useEffect(() => {
        console.log("Drawing Box");
        ctx.beginPath();
        ctx.fillRect(props.x, props.y, 25, 25);
        ctx.stroke();
    }, [ctx, props.x, props.y]);
    return null;
});
Box.displayName = "Box";

export type GameObjectState = Readonly<{
    width: number;
    height: number;
    x: number;
    y: number;
    dx: number;
    dy: number;
    anchor: { x: number; y: number };
    opacity: number;
    rotation: number;
    scaleX: number;
    scaleY: number;
}>;

const GameObject: React.FC<
    Readonly<{
        initialState: GameObjectState;
        update: (deltaTime: number) => GameObjectState;
        render: (context) => CanvasRenderingContext2D;
    }>
> = (props) => {
    const context = useCanvasContext();
    return null;
};

export const Scene: React.FC<SceneProps> = () => {
    React.useEffect(() => {
        console.log("Scene Mounted");
        return () => {
            console.log("Scene Unmounted");
        };
    }, []);
    const ctx = useCanvasContext();
    React.useLayoutEffect(() => {
        console.log("REDRAWING");
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        // ctx.beginPath();
        // ctx.fillRect(
        //     ctx.canvas.width / 2 - 25,
        //     ctx.canvas.height / 2 - 25,
        //     25,
        //     25
        // );
        // ctx.stroke();
    }, [ctx]);

    return (
        <>
            <Box x={ctx.canvas.width / 2 - 25} y={ctx.canvas.height / 2 - 25} />
            <Box x={ctx.canvas.width / 4 - 25} y={ctx.canvas.height / 4 - 25} />
        </>
    );
};
