import { LinkButton } from "~/components/Core";
import { Layout } from "~/components/Layout";
import { MainNavBar } from "~/components/NavBar";

import { useOptionalUser } from "~/Utils";

export default function Index() {
    const user = useOptionalUser();
    return (
        <Layout navElement={<MainNavBar />}>
            <div className="relative h-full w-full shadow-xl sm:overflow-hidden">
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
                        {user ? (
                            <LinkButton
                                className="text-3xl"
                                variant="contained"
                                color="primary"
                                to={{ pathname: "/game" }}
                            >
                                PLAY NOW
                            </LinkButton>
                        ) : (
                            <LinkButton
                                className="text-3xl"
                                variant="contained"
                                color="primary"
                                to={{
                                    pathname: "/join",
                                    search: new URLSearchParams([
                                        ["redirectTo", "/game"],
                                    ]).toString(),
                                }}
                            >
                                PLAY FREE
                            </LinkButton>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
