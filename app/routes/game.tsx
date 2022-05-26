import * as React from "react";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { requireUserId } from "~/Session.server";
import { useLoaderData } from "@remix-run/react";
import { useUser } from "~/Utils";
import { forceRun } from "~/vendor/Prisma";
import { GameLoop } from "~/game/GameLoop";
import { GameUI } from "~/game/GameUI";
import { Scene } from "~/game/Scene";
import { ClientOnly } from "~/components/ClientOnly";
import { WebSocketProvider } from "~/WebSocketContext";

type LoaderData = {};

export const loader: LoaderFunction = async ({ request, params }) => {
    await forceRun(requireUserId(request));
    return json<LoaderData>({});
};

export default function GamePage() {
    const data = useLoaderData<LoaderData>();
    const user = useUser();

    return (
        <main className="flex h-full">
            <WebSocketProvider>
                <ClientOnly fallback={<p>Loading...</p>}>
                    {() => (
                        <>
                            <GameUI />
                            <GameLoop>
                                <Scene />
                            </GameLoop>
                        </>
                    )}
                </ClientOnly>
            </WebSocketProvider>
        </main>
    );
}
