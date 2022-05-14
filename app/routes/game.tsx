import * as React from "react";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { requireUserId } from "~/Session.server";
import { useUser } from "~/Utils";
import { forceRun } from "~/vendor/Prisma";
import { GameLoop } from "~/game/GameLoop";
import { GameUI } from "~/game/GameUI";
import { Scene } from "~/game/Scene";

type LoaderData = {};

export const loader: LoaderFunction = async ({ request, params }) => {
    await forceRun(requireUserId(request));
    return json<LoaderData>({});
};

export default function GamePage() {
    const data = useLoaderData<LoaderData>();
    const user = useUser();

    return (
        <div>
            <header></header>
            <main className="flex h-full">
                <GameUI />
                <GameLoop>
                    <Scene />
                </GameLoop>
            </main>
        </div>
    );
}
