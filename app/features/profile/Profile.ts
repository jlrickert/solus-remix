import * as T from "~/vendor/Codec";
import type { Profile as PrismaProfile } from "~/vendor/Prisma";

export type Profile = PrismaProfile & { theme: Theme };

export type Theme = "system" | "light" | "dark";

function switchInvariant(value: never): boolean {
    return false;
}

export function isTheme(value: unknown): value is Theme {
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

const themeC = new T.Type<Theme, string, unknown>(
    "Theme",
    (u): u is Theme => {
        return typeof u === "string" && isTheme(u);
    },
    (u, c) => {
        if (typeof u === "string" && isTheme(u)) {
            return T.success(u);
        }
        return T.failure(u, c);
    },
    (a) => a
);

export const codec: T.Type<Profile> = T.strict<
    Record<keyof PrismaProfile, T.Mixed>
>({
    userId: T.string,
    nickname: T.union([T.null, T.string]),
    theme: themeC,
    createdAt: T.date,
    updatedAt: T.date,
});

export function isProfile(profile: any): profile is Profile {
    return codec.is(profile);
}
