import { useEffect } from "react";
import { useSocket } from "~/Store";

export default function Index() {
  const socket = useSocket();

  console.log(socket);
  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on("event", (data) => {
      console.log(data);
    });

    socket.emit("event", "ping");
  }, [socket]);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Welcome to Remix + Socket.io</h1>
      <div>
        <button type="button" onClick={() => socket?.emit("event", "ping")}>
          Send ping
        </button>
      </div>
      <p>See Browser console and Server terminal</p>
    </div>
  );
}
