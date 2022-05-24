export type Position = Readonly<{
    x: number;
    y: number;
}>;

export type GameState = Readonly<{
    tick: number;
    playerPosition: Position;
    width: number;
    height: number;
}>;

export function makeEmpty(): GameState {
    return {
        tick: 0,
        width: 500,
        height: 500,
        playerPosition: {
            x: 0,
            y: 0,
        },
    };
}

export function sync(): (state: GameState) => GameState {
    return (a) => a;
}
