import { Link } from "@remix-run/react";
import { MainNavBar } from "~/components/NavBar";

import { useOptionalUser } from "~/Utils";

export default function Index() {
    const user = useOptionalUser();
    return (
        <div className="flex h-full min-h-screen flex-col">
            <MainNavBar />
            <main className="relative min-h-screen bg-black sm:flex sm:items-center sm:justify-center">
                <div className="relative shadow-xl sm:overflow-hidden">
                    <div className="absolute inset-0">
                        <img
                            className="h-full w-full object-cover"
                            src="https://www.diyphotography.net/wp-content/uploads/2017/04/The-Milky-Way-Center-Aglow-with-Dust.jpg"
                            alt="part of the milky way with on orangish glow"
                        />
                        <div className="absolute inset-0 bg-[color:rgba(254,204,27,0.5)] mix-blend-multiply" />
                    </div>
                    <div className="lg:pb-18 relative px-4 pt-16 pb-8 sm:px-6 sm:pt-24 sm:pb-14 lg:px-8 lg:pt-32">
                        <h1 className="text-center text-6xl font-extrabold tracking-tight sm:text-8xl lg:text-9xl">
                            <span className="block uppercase text-yellow-500 drop-shadow-md">
                                Solus
                            </span>
                        </h1>
                        <div className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center">
                            <Link
                                to={
                                    user
                                        ? { pathname: "/game" }
                                        : {
                                              pathname: "/join",
                                              search: new URLSearchParams([
                                                  ["redirectTo", "/game"],
                                              ]).toString(),
                                          }
                                }
                                className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-yellow-700 shadow-sm hover:bg-yellow-50 sm:px-8"
                            >
                                PLAY NOW
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
