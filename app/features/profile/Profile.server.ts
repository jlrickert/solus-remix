import type * as TE from "fp-ts/lib/TaskEither";
import type { User } from "~/models/User.server";
import type { PrismaError, Profile } from "~/vendor/Prisma";
import { convertToTaskEither } from "~/vendor/Prisma";

import { prisma } from "~/db.server";

export { Profile };

export function getProfileById(
    id: User["id"]
): TE.TaskEither<PrismaError, Profile | null> {
    return convertToTaskEither(() =>
        prisma.profile.findUnique({ where: { userId: id } })
    );
}

type UpdateProfileProps = Pick<Profile, "userId"> &
    Partial<Omit<Profile, "createdAt" | "updatedAt">>;
export function update(
    profile: UpdateProfileProps
): TE.TaskEither<PrismaError, Profile> {
    return convertToTaskEither(() => {
        return prisma.profile.update({
            where: { userId: profile.userId },
            data: profile,
        });
    });
}
