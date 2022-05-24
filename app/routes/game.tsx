import * as React from "react";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { requireUserId } from "~/Session.server";
// import { useLoaderData } from "@remix-run/react";
// import { useUser } from "~/Utils";
import { forceRun } from "~/vendor/Prisma";
import { GameLoop } from "~/game/GameLoop";
import { GameUI } from "~/game/GameUI";
import { Scene } from "~/game/Scene";
import { Subject } from "rxjs";

type LoaderData = {};

export const loader: LoaderFunction = async ({ request, params }) => {
    await forceRun(requireUserId(request));
    return json<LoaderData>({});
};

export default function GamePage() {
    // const data = useLoaderData<LoaderData>();
    // const user = useUser();
    const [sizing, setSizing] = React.useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    React.useEffect(() => {
        new Subject()
    }, [])

    React.useEffect(() => {
        window.addEventListener("resize", () => {
            setSizing({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        });
    }, []);

    return (
        <main className="relative flex h-full">
            <GameUI />
            <GameLoop width={sizing.width} height={sizing.height}>
                <Scene />
            </GameLoop>
        </main>
    );
}
