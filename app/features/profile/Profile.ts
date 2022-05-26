import * as T from "io-ts";
import type * as TE from "fp-ts/lib/TaskEither";
import type { User } from "~/models/User.server";
import type { PrismaError, Profile } from "~/vendor/Prisma";
import { convertToTaskEither } from "~/vendor/Prisma";
import { prisma } from "~/db.server";
import { pipe } from "fp-ts/lib/function";

export { Profile };

export type Theme = "system" | "light" | "dark";

function switchInvariant(value: never): boolean {
    return false;
}

export function isTheme(value: string): value is Theme {
    const v = value as Theme;
    if (v === "dark") {
        return true;
    } else if (v === "light") {
        return true;
    } else if (v === "system") {
        return true;
    } else {
        return switchInvariant(v);
    }
}

const date = new T.Type<Date, Date, unknown>(
    "Date",
    (u): u is Date => u instanceof Date,
    (u, c) => {
        if (u instanceof Date) {
            return T.success(u);
        }
        return T.failure(u, c);
    },
    (a) => a
);

const codec = T.strict<Record<keyof Profile, T.Mixed>>({
    userId: T.string,
    nickname: T.union([T.null, T.string]),
    theme: T.string,
    createdAt: date,
    updatedAt: date,
});

export function isProfile(profile: unknown): profile is Profile {
    return codec.is(profile);
}
