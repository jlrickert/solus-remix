import type {
    ActionFunction,
    LoaderFunction,
    MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, useSearchParams } from "@remix-run/react";

import { getUserId, createUserSession } from "~/Session.server";

import { createUser, getUserByEmail } from "~/models/User.server";
import { safeRedirect, validateEmail } from "~/Utils";
import { forceRun } from "~/vendor/Prisma";
import { SignUpForm } from "~/components/AuthForms";

export const loader: LoaderFunction = async ({ request }) => {
    const userId = await getUserId(request)();
    if (userId) {
        return redirect("/");
    }
    return json({});
};

type ActionData = Readonly<{
    errors?: Readonly<{
        email: string | null;
        password: string | null;
    }>;
}>;

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const email = formData.get("email");
    const password = formData.get("password");
    const redirectTo = safeRedirect(formData.get("redirectTo"), "/");

    if (!validateEmail(email)) {
        return json<ActionData>(
            { errors: { email: "Email is invalid", password: null } },
            { status: 400 }
        );
    }

    if (typeof password !== "string") {
        return json<ActionData>(
            { errors: { password: "Password is required", email: null } },
            { status: 400 }
        );
    }

    if (password.length < 8) {
        return json<ActionData>(
            { errors: { password: "Password is too short", email: null } },
            { status: 400 }
        );
    }

    const existingUser = await forceRun(getUserByEmail(email));
    if (existingUser) {
        return json<ActionData>(
            {
                errors: {
                    password: null,
                    email: "A user already exists with this email",
                },
            },
            { status: 400 }
        );
    }

    const user = await forceRun(createUser(email, password));

    return createUserSession({
        request,
        userId: user.id,
        remember: false,
        redirectTo,
    })();
};

export const meta: MetaFunction = () => {
    return {
        title: "Sign Up",
    };
};

export default function Join() {
    const [searchParams] = useSearchParams();
    const redirectTo = searchParams.get("redirectTo") ?? null;
    const actionData = useActionData() as ActionData;

    return (
        <div className="flex min-h-full flex-col justify-center">
            <div className="mx-auto w-full max-w-md px-8">
                <SignUpForm
                    emailError={actionData?.errors?.email ?? null}
                    passwordError={actionData?.errors?.password ?? null}
                    redirectTo={redirectTo}
                />
            </div>
        </div>
    );
}
