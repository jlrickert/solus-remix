export type GameState = {};

export function makeEmpty(): GameState {
    return {};
}

export function sync(): (state: GameState) => GameState {
    return (a) => a;
}
