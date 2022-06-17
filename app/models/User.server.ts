import * as TE from "fp-ts/lib/TaskEither";
import { pipe } from "fp-ts/lib/function";
import bcrypt from "bcryptjs";

import * as Prisma from "~/vendor/Prisma";
import { prisma as db } from "~/db.server";
import type * as Profile from "~/features/profile/Profile";

export type User = Prisma.User;

export function getUserById(
    id: User["id"]
): TE.TaskEither<Prisma.PrismaError, User | null> {
    return Prisma.convertToTaskEither(() => {
        return db.user.findUnique({ where: { id } });
    });
}

export function getUserByEmail(
    email: User["email"]
): TE.TaskEither<Prisma.PrismaError, User | null> {
    return Prisma.convertToTaskEither(() => {
        return db.user.findUnique({ where: { email } });
    });
}

export function getUserByNickname(
    nickname: Profile.Profile["nickname"]
): TE.TaskEither<Prisma.PrismaError, User | null> {
    return pipe(
        Prisma.convertToTaskEither(async () => {
            return db.profile.findUnique({
                where: { nickname },
                include: { user: true },
            });
        }),
        TE.map((u) => u?.user ?? null)
    );
}

export function createUser(
    input: Readonly<{
        nickname: Profile.Profile["nickname"];
        email: User["email"];
        password: string;
    }>
): TE.TaskEither<Prisma.PrismaError, User> {
    const { email, nickname, password } = input;
    return Prisma.convertToTaskEither(async () => {
        const hashedPassword = await bcrypt.hash(password, 10);

        return db.user.create({
            data: {
                email,
                password: {
                    create: {
                        hash: hashedPassword,
                    },
                },
                profile: {
                    create: {
                        theme: "system",
                        nickname,
                    },
                },
            },
        });
    });
}

export function deleteUser(
    email: string
): TE.TaskEither<Prisma.PrismaError, void> {
    return Prisma.convertToTaskEither(async () => {
        await db.user.delete({ where: { email } });
    });
}

export function userCount(): TE.TaskEither<Prisma.PrismaError, number> {
    return Prisma.convertToTaskEither(() => db.user.count());
}

export function deleteUserByEmail(
    email: User["email"]
): TE.TaskEither<Prisma.PrismaError, User> {
    return Prisma.convertToTaskEither(async () => {
        return db.user.delete({ where: { email } });
    });
}

export function deleteAllTestUsers(): TE.TaskEither<Prisma.PrismaError, void> {
    return Prisma.convertToTaskEither(async () => {
        await db.user.deleteMany({
            where: { email: { contains: "@example.com" } },
        });
    });
}

export function verifyLogin(
    email: User["email"],
    password: Prisma.Password["hash"]
): TE.TaskEither<Prisma.PrismaError, User | null> {
    return Prisma.convertToTaskEither(async () => {
        const userWithPassword = await db.user.findUnique({
            where: { email },
            include: {
                password: true,
            },
        });

        if (!userWithPassword || !userWithPassword.password) {
            return null;
        }

        const isValid = await bcrypt.compare(
            password,
            userWithPassword.password.hash
        );

        if (!isValid) {
            return null;
        }

        const { password: _password, ...userWithoutPassword } =
            userWithPassword;

        return userWithoutPassword;
    });
}

export function updatePassword(
    input: Readonly<{
        email: User["email"];
        currentPassword: string;
        newPassword: string;
    }>
): TE.TaskEither<Prisma.PrismaError, void> {
    return Prisma.convertToTaskEither(async () => {
        const { currentPassword, email, newPassword } = input;
        const userWithPassword = await db.user.findUnique({
            where: { email },
            include: {
                password: true,
            },
        });

        if (!userWithPassword || !userWithPassword.password) {
            return;
        }

        const isValid = await bcrypt.compare(
            currentPassword,
            userWithPassword.password.hash
        );

        if (!isValid) {
            return;
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await db.user.update({
            data: { password: { update: { hash: hashedPassword } } },
            where: { email },
        });
    });
}
