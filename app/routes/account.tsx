import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useCatch, useLoaderData } from "@remix-run/react";

import type * as UserRepo from "~/models/User.server";
import * as ProfileRepo from "~/features/profile/ProfileRepo.server";
import type * as Profile from "~/features/profile/Profile";
import * as Prisma from "~/vendor/Prisma";
import { requireUser } from "~/Session.server";
import { useProfile, useUser } from "~/Utils";
import { Layout } from "~/components/Layout";
import { MainNavBar } from "~/components/NavBar";

// type LoaderData = Readonly<{
//     user: UserRepo.User;
//     profile: Profile.Profile;
// }>;

// export const loader: LoaderFunction = async ({ request, params }) => {
//     const user = await Prisma.forceRun(requireUser(request));
//     const profile = await Prisma.forceRun(
//         ProfileRepo.getProfileByUserId(user.id)
//     );
//     if (!profile) {
//         throw new Response("Not Found", { status: 404 });
//     }
//     return json<LoaderData>({ user, profile });
// };

export function CatchBoundary() {
    const caught = useCatch();

    if (caught.status === 404) {
        return <div>Profile not found</div>;
    }

    throw new Error(`Unexpected caught response with status: ${caught.status}`);
}

export default function ProfileDetailsPage() {
    const profile = useProfile();

    return (
        <Layout navElement={<MainNavBar />}>
            <div>
                <h3 className="text-2xl font-bold text-yellow-500">
                    {profile.nickname}
                </h3>
            </div>
        </Layout>
    );
}
