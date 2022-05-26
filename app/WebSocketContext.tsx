import * as React from "react";
import type { Socket } from "socket.io-client";
import { io } from "socket.io-client";
import invariant from "tiny-invariant";

const WebSocketContext = React.createContext<Socket | null>(null);

export const WebSocketProvider: React.FC<{ children?: React.ReactNode }> = (
    props
) => {
    const [socket, setSocket] = React.useState<Socket | null>(null);

    React.useEffect(() => {
        const socket = io();
        setSocket(socket);

        return () => {
            socket.close();
        };
    }, []);

    React.useEffect(() => {
        if (!socket) {
            return;
        }
        socket.on("confirmation", (data) => {
            console.log(data);
        });
    }, [socket]);

    if (socket === null) {
        return null;
    }

    return (
        <WebSocketContext.Provider value={socket}>
            {socket ? props.children : null}
        </WebSocketContext.Provider>
    );
};

export const useSocket = (): Socket => {
    const socket = React.useContext(WebSocketContext);
    invariant(socket, "Expected useSocket to be used in WebSocketProvider");
    return socket;
};
