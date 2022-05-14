import type * as HTTP from "http";
import type * as IO from "fp-ts/lib/IO";
import { Server } from "socket.io";

export function realtime(httpServer: HTTP.Server): IO.IO<void> {
  return () => {
    const io = new Server(httpServer);

    // Then you can use `io` to listen the `connection` event and get a socket
    // from a client
    io.on("connection", (socket) => {
      // from this point you are on the WS connection with a specific client
      console.log(socket.id, "connected");

      socket.emit("confirmation", "connected!");

      socket.on("event", (data) => {
        console.log(socket.id, data);
        socket.emit("event", "pong back to source");
        socket.broadcast.emit("event", "pong");
      });
    });
  };
}
