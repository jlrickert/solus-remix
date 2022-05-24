import * as React from "react";
import * as Rx from "rxjs";
import { CanvasProvider } from "./CanvasContext";

type FrameData = Readonly<{
    frameStartTime: number;
    deltaTime: number;
    frameId: number;
}>;

const makeFrameData = (frameData: FrameData): FrameData => {
    return {
        deltaTime: frameData.deltaTime,
        frameStartTime: frameData.frameStartTime,
        frameId: frameData.frameId,
    };
};

const clampFPS =
    (fps: number) =>
    (frame: FrameData): FrameData => {
        const step = 1 / fps;
        if (frame.deltaTime > step) {
            return makeFrameData({
                deltaTime: step,
                frameStartTime: frame.frameStartTime,
                frameId: frame.frameId,
            });
        }
        return frame;
    };

const calculateStep = (prevFrame?: FrameData): Rx.Observable<FrameData> => {
    return new Rx.Observable((observer) => {
        const frameId = requestAnimationFrame((frameStartTime) => {
            const deltaTime = prevFrame
                ? frameStartTime - prevFrame.frameStartTime
                : 0;
            observer.next({ frameStartTime, deltaTime, frameId });
        });
    });
};

const frames$ = Rx.of(undefined).pipe(
    Rx.expand((val) => calculateStep(val)),
    Rx.filter((frame) => frame !== undefined),
    Rx.map((frame) => frame.deltaTime),
    Rx.share()
);

const gameState$ = new Rx.BehaviorSubject({});

const steps$ = frames$.pipe(
    // don't update on loss of focus
    Rx.filter((deltaTime) => deltaTime > 1e3),
    Rx.expand((deltaTime) => new Rx.Observable<number>((observer) => {}))
);

export type GameLoopProps = Readonly<{
    width: number;
    height: number;
    onFrame?: (deltaTime: number) => void;
}>;

export const GameLoop: React.FC<GameLoopProps> = ({
    width,
    height,
    children,
    onFrame,
}) => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const [context, setContext] =
        React.useState<CanvasRenderingContext2D | null>(null);
    const rAFRef = React.useRef<number>();
    const focused = React.useRef<boolean>(true);
    const accumulator = React.useRef<number>(0);
    const dt = React.useRef<number>(0);
    const now = React.useRef<number>(performance.now());
    const last = React.useRef<number>(performance.now());

    React.useEffect(() => {
        window.addEventListener("focus", () => {
            focused.current = true;
        });
        window.addEventListener("blur", () => {
            focused.current = false;
        });
    }, []);

    const update = React.useRef(onFrame);
    React.useEffect(() => {
        update.current = onFrame;
    }, [onFrame]);

    React.useEffect(() => {
        const context = canvasRef.current?.getContext("2d") ?? null;
        setContext(context);
    }, []);

    React.useEffect(() => {
        if (!context) {
            return;
        }

        const step = 1 / 60;
        const delta = 1e3;
        const frame = (timestamp: number) => {
            rAFRef.current = requestAnimationFrame(frame);

            if (!focused.current) {
                return;
            }

            now.current = timestamp;
            dt.current = now.current - last.current;
            last.current = now.current;

            // prevent updating the game with a very large dt if the game
            // were to lose focus and then regain focus later
            if (dt.current > 1e3) {
                return;
            }

            accumulator.current += dt.current;

            while (accumulator.current >= delta) {
                if (update.current) {
                    update.current(step);
                }
                accumulator.current -= delta;
            }

            context.clearRect(
                0,
                0,
                context.canvas.width,
                context.canvas.height
            );
        };

        // const smoothing = 0.9; // larger numbers give smother numbers
        // fps.current =
        //     fps.current * smoothing +
        //     (1000 / (timestamp - previous.current)) * (1.0 - smoothing);
        // previous.current = timestamp;

        // if (isUpdateRequired) {
        //     setIsVisible(false);
        //     setIsVisible(true);
        //     setIsUpdateRequired(false);
        // }
        rAFRef.current = requestAnimationFrame(frame);
        return () => {
            rAFRef.current && cancelAnimationFrame(rAFRef.current);
        };
    }, [context]);

    return (
        <CanvasProvider context={context}>
            <canvas
                ref={canvasRef}
                width={width}
                height={height}
                onClick={(e) => {
                    console.log(e);
                }}
                className="absolute z-20 h-full w-full"
            />
            {context !== null && children}
        </CanvasProvider>
    );
};
