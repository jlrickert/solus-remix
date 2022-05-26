import * as React from "react";
import invariant from "tiny-invariant";

type GameCanvasState = {
    context: CanvasRenderingContext2D | null;
    fps: React.MutableRefObject<number>;
};
const GameCanvas = React.createContext<GameCanvasState | null>(null);

export function useCanvasContext(): CanvasRenderingContext2D {
    const data = React.useContext(GameCanvas);
    invariant(
        data !== null && data.context !== null,
        "useCanvasContext must be used within an initiated gameLoop"
    );
    return data.context;
}

export const CanvasProvider: React.FC<
    React.PropsWithChildren<GameCanvasState>
> = ({ children, context, fps }) => {
    return (
        <GameCanvas.Provider
            value={React.useMemo(() => ({ context, fps }), [context, fps])}
        >
            {children}
        </GameCanvas.Provider>
    );
};
