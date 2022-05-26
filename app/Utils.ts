import { useMatches } from "@remix-run/react";
import { useMemo } from "react";

import type { User } from "~/models/User.server";
import { isProfile } from "./features/profile/Profile";
import type { Profile } from "./features/profile/Profile";

const DEFAULT_REDIRECT = "/";

/**
 * This should be used any time the redirect path is user-provided
 * (Like the query string on our login/signup pages). This avoids
 * open-redirect vulnerabilities.
 * @param {string} to The redirect destination
 * @param {string} defaultRedirect The redirect to use if the to is unsafe.
 */
export function safeRedirect(
    to: FormDataEntryValue | string | null | undefined,
    defaultRedirect: string = DEFAULT_REDIRECT
): string {
    if (!to || typeof to !== "string") {
        return defaultRedirect;
    }

    if (!to.startsWith("/") || to.startsWith("//")) {
        return defaultRedirect;
    }

    return to;
}

/**
 * This base hook is used in other hooks to quickly search for specific data
 * across all loader data using useMatches.
 * @param {string} id The route id
 * @returns {JSON|undefined} The router data or undefined if not found
 */
export function useMatchesData(
    id: string
): Record<string, unknown> | undefined {
    const matchingRoutes = useMatches();
    const route = useMemo(
        () => matchingRoutes.find((route) => route.id === id),
        [matchingRoutes, id]
    );
    return route?.data;
}

function isUser(user: any): user is User {
    return user && typeof user === "object" && typeof user.email === "string";
}

export function useOptionalUser(): User | undefined {
    const data = useMatchesData("root");
    if (!data || !isUser(data.user)) {
        return undefined;
    }
    return data.user;
}

export function useUser(): User {
    const maybeUser = useOptionalUser();
    if (!maybeUser) {
        throw new Error(
            "No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead."
        );
    }
    return maybeUser;
}

export function useOptionalProfile(): Profile | undefined {
    const data = useMatchesData("root");
    if (!data) {
        return undefined;
    }
    const profile = data.profile;
    if (isProfile(profile)) {
        return profile;
    }
    return undefined;
}

export function useProfile(): Profile {
    const maybeProfile = useOptionalProfile();
    if (!maybeProfile) {
        throw new Error(
            "No profile found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead."
        );
    }
    return maybeProfile;
}

export function validateEmail(email: unknown): email is string {
    return typeof email === "string" && email.length > 3 && email.includes("@");
}
