import * as TE from "fp-ts/lib/TaskEither";
import { pipe } from "fp-ts/lib/function";

import { prisma } from "~/db.server";
import type { PrismaError, Note, User } from "~/vendor/Prisma";
import { convertToTaskEither } from "~/vendor/Prisma";

export { Note };

export function getNote({
    id,
    userId,
}: Pick<Note, "id"> & {
    userId: User["id"];
}): TE.TaskEither<PrismaError, Note | null> {
    return convertToTaskEither(() => {
        return prisma.note.findFirst({
            where: { id, userId },
        });
    });
}

export function getNoteListItems({
    userId,
}: Readonly<{ userId: User["id"] }>): TE.TaskEither<
    PrismaError,
    readonly Pick<Note, "id" | "title">[]
> {
    return pipe(
        convertToTaskEither(() => {
            return prisma.note.findMany({
                where: { userId },
                select: { id: true, title: true },
                orderBy: { updatedAt: "desc" },
            });
        }),
        TE.map((a) => [...a])
    );
}

export function createNote({
    body,
    title,
    userId,
}: Pick<Note, "body" | "title"> & {
    userId: User["id"];
}): TE.TaskEither<PrismaError, Note> {
    return convertToTaskEither(() => {
        return prisma.note.create({
            data: {
                title,
                body,
                user: {
                    connect: {
                        id: userId,
                    },
                },
            },
        });
    });
}

export function deleteNote({
    id,
    userId,
}: Pick<Note, "id"> & { userId: User["id"] }): TE.TaskEither<
    PrismaError,
    number
> {
    return pipe(
        convertToTaskEither(() =>
            prisma.note.deleteMany({
                where: { id, userId },
            })
        ),
        TE.map((a) => a.count)
    );
}
