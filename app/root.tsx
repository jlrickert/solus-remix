import * as React from "react";
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
import { getUser } from "~/Session.server";
import { store } from "~/Store";
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
    const user = await forceRun(getUser(request));
    return json<LoaderData>({
        user,
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
                    <Provider store={store} serverState={store.getState()}>
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
