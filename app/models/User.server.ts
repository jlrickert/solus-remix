import type * as TE from "fp-ts/lib/TaskEither";
import type { Password, User, PrismaError } from "~/vendor/Prisma";
import { convertToTaskEither } from "~/vendor/Prisma";
import bcrypt from "bcryptjs";

import { prisma } from "~/db.server";

export { User };

export function getUserById(
    id: User["id"]
): TE.TaskEither<PrismaError, User | null> {
    return convertToTaskEither(() => prisma.user.findUnique({ where: { id } }));
}

export function getUserByEmail(
    email: User["email"]
): TE.TaskEither<PrismaError, User | null> {
    return convertToTaskEither(() =>
        prisma.user.findUnique({ where: { email } })
    );
}

export function createUser(
    email: User["email"],
    password: string
): TE.TaskEither<PrismaError, User> {
    return convertToTaskEither(async () => {
        const hashedPassword = await bcrypt.hash(password, 10);

        return prisma.user.create({
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
                    },
                },
            },
        });
    });
}

export function deleteUser(email: string): TE.TaskEither<PrismaError, void> {
    return convertToTaskEither(() =>
        prisma.user.delete({ where: { email } }).then((a) => {})
    );
}

export function userCount(): TE.TaskEither<PrismaError, number> {
    return convertToTaskEither(() => prisma.user.count());
}

export function deleteUserByEmail(
    email: User["email"]
): TE.TaskEither<PrismaError, User> {
    return convertToTaskEither(() => prisma.user.delete({ where: { email } }));
}

export function verifyLogin(
    email: User["email"],
    password: Password["hash"]
): TE.TaskEither<PrismaError, User | null> {
    return convertToTaskEither(async () => {
        const userWithPassword = await prisma.user.findUnique({
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
