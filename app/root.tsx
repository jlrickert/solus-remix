import { useEffect, useState } from "react";
import type { Socket } from "socket.io-client";
import { io } from "socket.io-client";
import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import { forceRun } from "~/vendor/prisma";
import type { User } from "~/models/user.server";
import { getUser } from "~/session.server";
import { StoreProvider, createStore } from "~/store";
import tailwindStylesheetUrl from "~/styles/tailwind.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: tailwindStylesheetUrl }];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Solus",
  viewport: "width=device-width,initial-scale=1",
});

type LoaderData = Readonly<{
  user: User | null;
}>;

export const loader: LoaderFunction = async ({ request }) => {
  return json<LoaderData>({
    user: await forceRun(getUser(request)),
  });
};

export default function App() {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socket = io();
    setSocket(socket);

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.on("confirmation", (data) => {
      console.log(data);
    });
  }, [socket]);

  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        {!!socket && (
          <StoreProvider createStore={() => createStore({ socket })}>
            <Outlet />
          </StoreProvider>
        )}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
