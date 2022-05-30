import * as React from "react";
import * as TE from "fp-ts/lib/TaskEither";
import * as O from "fp-ts/lib/Option";
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
import { Provider } from "react-redux";

import { forceRun } from "~/vendor/Prisma";
import type { User } from "~/models/User.server";
import type { Profile } from "~/features/profile/Profile";
import { getUser } from "~/Session.server";
import { store } from "~/Store";
import tailwindStylesheetUrl from "~/styles/tailwind.css";
import { getProfileById } from "./features/profile/Profile.server";
import { pipe } from "fp-ts/lib/function";

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
    profile: Profile | null;
}>;

export const loader: LoaderFunction = async ({ request }) => {
    const t = O.traverse(TE.ApplicativeSeq);
    const userTask = getUser(request);
    const profileTask = pipe(
        userTask,
        TE.map((user) => O.fromNullable(user)),
        TE.chainW(t((user) => getProfileById(user.id))),
        TE.map((profile) => O.toNullable(profile))
    );
    const user = await forceRun(userTask);
    const profile = await forceRun(profileTask);
    return json<LoaderData>({
        user,
        profile,
    });
};

// export function ErrorBoundary({ error }: any) {
//     console.error(error);
//     return (
//         <html>
//             <head>
//                 <title>Oh no!</title>
//                 <Meta />
//                 <Links />
//             </head>
//             <body>
//                 {/* add the UI you want your users to see */}
//                 {JSON.stringify(error)}
//                 <Scripts />
//             </body>
//         </html>
//     );
// }

export default function App() {
    return (
        <html lang="en" className="h-full">
            <head>
                <Meta />
                <Links />
            </head>
            <body className="h-full">
                <React.StrictMode>
                    <Provider store={store} serverState={preloadedState}>
                        <Outlet />
                    </Provider>
                </React.StrictMode>
                <ScrollRestoration />
                <LiveReload />
                <Scripts />
            </body>
        </html>
    );
}
