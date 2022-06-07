import * as React from "react";
import type { LinkProps } from "@remix-run/react";
import { Link } from "@remix-run/react";
import { LogoutForm } from "./AuthForms";
import { useOptionalProfile } from "~/Utils";
import type { Profile } from "~/features/profile/Profile";
import { Button, IconButton, LinkButton } from "./Core";

const NavBarButton: React.FC<Readonly<LinkProps & {}>> = (props) => {
    return (
        <LinkButton variant="text" to={props.to} className={props.className}>
            {props.children}
        </LinkButton>
    );
};

const AuthenticatedBar: React.FC<
    Readonly<{
        profile: Profile;
    }>
> = ({ profile }) => {
    const [open, setOpen] = React.useState(false);
    return (
        <>
            <IconButton>
                <span className="sr-only">View notification</span>
                <NotificationsIcon />
            </IconButton>

            {/* profile dropdown */}
            <div className="relative ml-3">
                <IconButton onClick={() => setOpen((a) => !a)}>
                    <span className="sr-only">Open user menu</span>
                    <AvatarPlaceholderIcon />
                </IconButton>

                <div
                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    hidden={!open}
                    role="menu"
                >
                    <Link to="/account">Manage Account</Link>
                    <LogoutForm element={<button>Log out</button>} />
                </div>
            </div>
        </>
    );
};

const UnauthenticatedBar: React.FC<Readonly<{}>> = (props) => {
    return <NavBarButton to="/login">Log In</NavBarButton>;
};

const HamburgerIcon: React.FC<
    Readonly<{
        open?: boolean;
    }>
> = ({ open }) => {
    return (
        <svg
            className="block h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            aria-hidden="true"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
        </svg>
    );
};

const AvatarPlaceholderIcon: React.FC<JSX.IntrinsicElements["img"]> = (
    props
) => {
    return (
        <img
            {...props}
            className="h-8 w-8 rounded-full"
            src="https://www.mtsolar.us/wp-content/uploads/2020/04/avatar-placeholder.png"
            alt="avatar placeholder"
        />
    );
};

const NotificationsIcon: React.FC = () => {
    return (
        <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            aria-hidden="true"
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
        </svg>
    );
};

export type MainNavBarProps = Readonly<{}>;
export const MainNavBar: React.FC<MainNavBarProps> = () => {
    const profile = useOptionalProfile();
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

    return (
        <nav className="bg-slate-700">
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        {/* mobile menu */}
                        <button
                            type="button"
                            className="items-center justify-center rounded-md bg-gray-700 p-2 text-slate-500 hover:inline-flex hover:text-white focus:outline-none focus:ring-white"
                            aria-controls="mobile-menu"
                            aria-expanded={mobileMenuOpen}
                            onClick={() => setMobileMenuOpen((a) => !a)}
                        >
                            <span className="sr-only">Open main menu</span>
                            <HamburgerIcon open={mobileMenuOpen} />
                        </button>
                    </div>
                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="flex flex-shrink-0 items-center ">
                            <Link
                                className="text-base font-bold text-yellow-500 hover:text-yellow-400 active:text-yellow-400"
                                to="/"
                            >
                                SOLUS
                            </Link>
                        </div>
                        <div className="hidden sm:ml-6 sm:block">
                            <div className="flex space-x-4">
                                <NavBarButton to="/profiles">
                                    Corporations
                                </NavBarButton>
                                <NavBarButton to="/market">Market</NavBarButton>
                            </div>
                        </div>
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                        {profile ? (
                            <AuthenticatedBar profile={profile} />
                        ) : (
                            <UnauthenticatedBar />
                        )}
                    </div>
                </div>
            </div>
            <div
                hidden={!mobileMenuOpen}
                id="mobile-menu"
                className="justify-start sm:hidden"
            >
                <div className="space-y-1 px-2 pt-2 pb-3">
                    <NavBarButton to="/profiles">Corporations</NavBarButton>
                    <NavBarButton to="/market">Market</NavBarButton>
                </div>
            </div>
        </nav>
    );
};
