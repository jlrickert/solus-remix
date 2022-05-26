import type * as TE from "fp-ts/lib/TaskEither";
import type { User } from "~/models/User.server";
import type { PrismaError, Profile } from "~/vendor/Prisma";
import { convertToTaskEither } from "~/vendor/Prisma";
import { prisma } from "~/db.server";

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
