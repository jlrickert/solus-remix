import type { Dispatch, Reducer } from "react";
import type { Socket } from "socket.io-client";
import type { StoreApi } from "zustand";
import create from "zustand";
import createContext from "zustand/context";
import { redux, devtools } from "zustand/middleware";

import type { User } from "~/models/User.server";
import * as GameState from "./game/GameState";

const { Provider, useStore } =
    createContext<
        StoreApi<
            GlobalState & { dispatch: (action: GlobalAction) => GlobalAction }
        >
    >();

export type GlobalState = Readonly<{
    socket: Socket | null;
    game: GameState.GameState;
}>;
export type GlobalAction =
    | { type: "TICK"; tick: number }
    | { type: "RESYNC" }
    | {
          type: "CHAT_RECEIVE";
          messages: readonly string[];
      }
    | {
          type: "CHAT_SEND";
          userId: User["id"];
          message: string;
      };

export const tick = (tick: number): GlobalAction => {
    return { type: "TICK", tick };
};

const reducer: Reducer<GlobalState, GlobalAction> = (state, action) => {
    return state;
};

export function createStore(deps: Readonly<{ socket: Socket }>) {
    return create(
        devtools(
            redux(reducer, { socket: deps.socket, game: GameState.makeEmpty() })
        )
    );
}

export function useSocket(): Socket | null {
    return useStore((state) => state.socket);
}

export function useDispatch(): Dispatch<GlobalAction> {
    return useStore((state) => state.dispatch);
}

export { Provider as StoreProvider };
