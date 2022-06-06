import * as React from "react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/node";
import { NavLink, Outlet, useLoaderData } from "@remix-run/react";

import { MainNavBar } from "~/components/NavBar";
import type * as Profile from "~/features/profile/Profile";
import * as ProfileRepo from "~/features/profile/ProfileRepo.server";
import * as Prisma from "~/vendor/Prisma";

type LoaderData = Readonly<{
    profileListItems: readonly Pick<Profile.Profile, "nickname">[];
}>;

export const loader: LoaderFunction = async ({ request }) => {
    const profileListItems = await Prisma.forceRun(
        ProfileRepo.getProfileListItems()
    );
    return json<LoaderData>({ profileListItems });
};

export default function ProfilesPage() {
    const searchRef = React.useRef<HTMLInputElement>(null);
    const [profileSearchInput, setProfileSearchInput] = React.useState("");
    const data = useLoaderData() as LoaderData;
    return (
        <div className="flex h-full min-h-screen flex-col">
            <MainNavBar />
            <main className="flex h-full bg-white">
                <div className="relative inline-block text-left">
                    <div>
                        <label htmlFor="profile-search">Search</label>
                        <div className="mt-1">
                            <input
                                ref={searchRef}
                                id="profile-search"
                                name="profile-search"
                                type="search"
                                aria-describedby="profile-search"
                                className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
                                value={profileSearchInput}
                                onChange={(e) => {
                                    setProfileSearchInput(
                                        e.currentTarget.value
                                    );
                                }}
                            />
                        </div>
                    </div>
                    <div
                        className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="profile-search"
                        tabIndex={-1}
                    >
                        {data.profileListItems.map((profile) => {
                            return (
                                <NavLink
                                    key={profile.nickname}
                                    className="block border-b p-4 text-xl"
                                    to={profile.nickname}
                                >
                                    {profile.nickname}
                                </NavLink>
                            );
                        })}
                    </div>
                </div>
                <Outlet />
            </main>
        </div>
    );
}
