import { pipe } from "fp-ts/lib/function";
import * as React from "react";
import { CanvasProvider } from "./CanvasContext";

export const GameLoop: React.FC = ({ children }) => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const [ctx, setCtx] = React.useState<CanvasRenderingContext2D | null>(null);
    const [isVisible, setIsVisible] = React.useState(false);
    const [isUpdateRequired, setIsUpdateRequired] = React.useState(false);
    const loopRef = React.useRef<number>(-1);
    const width = 500;
    const height = 500;

    let previous = React.useRef(0);
    const fps = React.useRef<number>(0);
    const tick = React.useCallback(
        (timestamp: number) => {
            const smoothing = 0.9; // larger numbers give smother numbers
            fps.current =
                fps.current * smoothing +
                (1000 / (timestamp - previous.current)) * (1.0 - smoothing);
            previous.current = timestamp;
            if (isUpdateRequired) {
                setIsVisible(false);
                setIsVisible(true);
                setIsUpdateRequired(false);
            }
            loopRef.current = requestAnimationFrame(tick);
        },
        [isUpdateRequired]
    );

    React.useEffect(() => {
        setCtx(canvasRef.current?.getContext("2d") ?? null);
        setIsUpdateRequired(true);
    }, []);

    React.useEffect(() => {
        loopRef.current = requestAnimationFrame(tick);
        return () => {
            loopRef.current && cancelAnimationFrame(loopRef.current);
        };
    }, [tick]);

    return (
        <CanvasProvider context={ctx} fps={fps}>
            <canvas ref={canvasRef} width={width} height={height} />
            {isVisible && ctx !== null && children}
        </CanvasProvider>
    );
};
