import * as TE from "fp-ts/lib/TaskEither";
import { pipe } from "fp-ts/lib/function";

import type { User } from "~/models/User.server";
import * as Prisma from "~/vendor/Prisma";
import { prisma as db } from "~/db.server";

import * as Profile from "./Profile";

export function getProfileByUserId(
    id: User["id"]
): TE.TaskEither<Prisma.PrismaError, Profile.Profile | null> {
    return pipe(
        Prisma.convertToTaskEither(() => {
            return db.profile.findUnique({ where: { userId: id } });
        }),
        TE.map((dto) => {
            return dto ? Profile.fromPrisma(dto) : null;
        })
    );
}

export function getProfileByUserNickname(
    nickname: Profile.Profile["nickname"]
): TE.TaskEither<Prisma.PrismaError, Profile.Profile | null> {
    return pipe(
        Prisma.convertToTaskEither(() => {
            return db.profile.findUnique({
                where: { nickname },
            });
        }),
        TE.map((dto) => {
            return Profile.fromJSON(dto);
        })
    );
}

export function getProfileListItems(): TE.TaskEither<
    Prisma.PrismaError,
    readonly Pick<Profile.Profile, "nickname">[]
> {
    return Prisma.convertToTaskEither(async () => {
        return db.profile.findMany({ select: { nickname: true } });
    });
}

type UpdateProfileProps = Pick<Profile.Profile, "userId"> &
    Partial<Omit<Profile.Profile, "createdAt" | "updatedAt">>;
export function update(
    profile: UpdateProfileProps
): TE.TaskEither<Prisma.PrismaError, Profile.Profile> {
    const { userId, nickname, theme } = profile;
    return pipe(
        Prisma.convertToTaskEither(() => {
            return db.profile.update({
                where: { userId },
                data: { nickname, theme },
            });
        }),
        TE.map((dto) => {
            return Profile.fromJSON(dto);
        })
    );
}
