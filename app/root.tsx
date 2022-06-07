import * as React from "react";
import * as TE from "fp-ts/lib/TaskEither";
import * as O from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/function";
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
    useCatch,
} from "@remix-run/react";
import { Provider as ReduxProvider } from "react-redux";

import { forceRun } from "~/vendor/Prisma";
import type * as UserRepo from "~/models/User.server";
import type * as Profile from "~/features/profile/Profile";
import * as SessionRepo from "~/Session.server";
import * as AppStore from "~/Store";
import tailwindStylesheetUrl from "~/styles/tailwind.css";
import * as ProfileApi from "~/features/profile/ProfileRepo.server";
import { profileApi } from "./features/profile/ProfileSlice";
import { Layout } from "./components/Layout";
import { MainNavBar } from "./components/NavBar";

export const links: LinksFunction = () => {
    return [{ rel: "stylesheet", href: tailwindStylesheetUrl }];
};

export const meta: MetaFunction = () => ({
    charset: "utf-8",
    title: "Solus",
    viewport: "width=device-width,initial-scale=1",
});

type LoaderData = Readonly<{
    user: UserRepo.User | null;
    profile: Profile.Profile | null;
}>;

export const loader: LoaderFunction = async ({ request }) => {
    const t = O.traverse(TE.ApplicativeSeq);
    const userTask = SessionRepo.getUser(request);
    const profileTask = pipe(
        userTask,
        TE.map((user) => O.fromNullable(user)),
        TE.chainW(t((user) => ProfileApi.getProfileByUserId(user.id))),
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
export function CatchBoundary() {
    const caught = useCatch();
    return (
        <html className="h-full">
            <head>
                <title>Oops!</title>
                <Meta />
                <Links />
            </head>
            <body className="h-full">
                <Layout navElement={<MainNavBar />}>
                    <h1 className="text-zinc-100">
                        {caught.status} {caught.statusText}
                    </h1>
                </Layout>
                <Scripts />
            </body>
        </html>
    );
}

export default function App() {
    React.useEffect(() => {
        AppStore.store.dispatch(profileApi.util.resetApiState());
    }, []);

    return (
        <html lang="en" className={`h-full`}>
            <head>
                <Meta />
                <Links />
            </head>
            <body className="h-full">
                <React.StrictMode>
                    <ReduxProvider
                        store={AppStore.store}
                        // serverState={AppStore.preloadedState({
                        //     profileApi: {},
                        //     profile: {
                        //         profile: profile ?? null,
                        //         status: profile ? "success" : "idle",
                        //     },
                        // })}
                    >
                        <Outlet />
                    </ReduxProvider>
                </React.StrictMode>
                <ScrollRestoration />
                <LiveReload />
                <Scripts />
            </body>
        </html>
    );
}
