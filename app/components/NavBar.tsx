import * as React from "react";
import { Link } from "@remix-run/react";
import { LogoutForm } from "./AuthForms";
import { useOptionalProfile } from "~/Utils";
import type { Profile } from "~/features/profile/Profile";
import { LinkButton } from "./Core";

const AuthenticatedBar: React.FC<
    Readonly<{
        profile: Profile;
    }>
> = (props) => {
    return (
        <>
            <span>{props.profile.nickname}</span>
            <LinkButton
                to="/account"
                className="rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
            >
                My Account
            </LinkButton>
            <LogoutForm />
        </>
    );
};

const UnauthenticatedBar: React.FC<Readonly<{}>> = (props) => {
    return (
        <>
            <LinkButton to="/join">Sign up</LinkButton>
            <LinkButton to="/login">Log In</LinkButton>
        </>
    );
};

export type MainNavBarProps = Readonly<{}>;
export const MainNavBar: React.FC<MainNavBarProps> = () => {
    const profile = useOptionalProfile();

    return (
        <nav className="mx-auto flex h-16 w-full items-center gap-8 bg-slate-800 px-4 text-white sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold">
                <Link to="/">Solus</Link>
            </h1>
            <span className="flex-grow" />
            {profile ? (
                <AuthenticatedBar profile={profile} />
            ) : (
                <UnauthenticatedBar />
            )}
        </nav>
    );
};
