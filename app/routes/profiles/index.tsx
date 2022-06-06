import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { NavLink, useLoaderData } from "@remix-run/react";

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
    const data = useLoaderData() as LoaderData;
    return (
        <ol>
            {data.profileListItems.map((profile) => {
                return (
                    <li key={profile.nickname}>
                        <NavLink
                            className="block border-b p-4 text-xl"
                            to={profile.nickname}
                        >
                            {profile.nickname}
                        </NavLink>
                    </li>
                );
            })}
        </ol>
    );
}
