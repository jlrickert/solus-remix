import * as React from "react";
import { Link } from "@remix-run/react";
import { LogoutForm } from "./AuthForms";
import { useOptionalUser } from "~/Utils";

export type MainNavBarProps = Readonly<{}>;

export const MainNavBar: React.FC<MainNavBarProps> = () => {
    const user = useOptionalUser();
    return (
        <nav className="flex items-start justify-center bg-slate-800 p-4 text-white">
            <h1 className="text-3xl font-bold">
                <Link to="/">Solus</Link>
            </h1>
            <span className="flex-grow" />
            {user ? (
                <LogoutForm />
            ) : (
                <>
                    <Link
                        to="/join"
                        className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-yellow-700 shadow-sm hover:bg-yellow-50 sm:px-8"
                    >
                        Sign up
                    </Link>
                    <Link
                        to="/login"
                        className="flex items-center justify-center rounded-md bg-yellow-500 px-4 py-3 font-medium text-white hover:bg-yellow-600"
                    >
                        Log In
                    </Link>
                </>
            )}
        </nav>
    );
};
