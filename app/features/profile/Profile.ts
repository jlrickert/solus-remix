import { pipe } from "fp-ts/lib/function";
import * as E from "fp-ts/lib/Either";
import invariant from "tiny-invariant";

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

export const jsonCodec: T.Type<Profile> = T.strict<
    Record<keyof PrismaProfile, T.Mixed>
>({
    userId: T.string,
    nickname: T.union([T.null, T.string]),
    theme: T.string,
    createdAt: T.iso8601Date,
    updatedAt: T.iso8601Date,
});

export function isProfile(profile: unknown): profile is Profile {
    return jsonCodec.is(profile);
}

export const fromPrisma = (profile: PrismaProfile): Profile => {
    return {
        ...profile,
        theme: isTheme(profile.theme) ? profile.theme : "system",
    };
};

export const fromJSON = (json: unknown): Profile => {
    const data = pipe(json, jsonCodec.decode);
    invariant(
        E.isRight(data),
        `Expected a valid profile: ${pipe(
            json,
            T.getErrorMessages(jsonCodec),
            (message) => JSON.stringify(message, undefined, 2)
        )}`
    );
    const profile = data.right;
    return {
        ...profile,
        theme: isTheme(data.right.theme) ? profile.theme : "system",
    };
};
