import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import invariant from "tiny-invariant";
import { useCatch, useLoaderData } from "@remix-run/react";

import * as ProfileRepo from "~/features/profile/ProfileRepo.server";
import type * as Profile from "~/features/profile/Profile";
import * as Prisma from "~/vendor/Prisma";

type LoaderData = Readonly<{
    profile: Profile.Profile;
}>;

export const loader: LoaderFunction = async ({ request, params }) => {
    invariant(params.nickname, "nickname not found");
    const profile = await Prisma.forceRun(
        ProfileRepo.getProfileByUserNickname(params.nickname)
    );

    if (!profile) {
        throw new Response("Not Found", { status: 404 });
    }
    return json<LoaderData>({ profile });
};

export function CatchBoundary() {
    const caught = useCatch();

    if (caught.status === 404) {
        return <div>Profile not found</div>;
    }

    throw new Error(`Unexpected caught response with status: ${caught.status}`);
}

export default function ProfileDetailsPage() {
    const data = useLoaderData() as LoaderData;

    return (
        <div>
            <h3 className="text-2xl font-bold">{data.profile.nickname}</h3>
        </div>
    );
}
