import { Form, Link, useSearchParams } from "@remix-run/react";
import * as React from "react";
import { Button } from "./Core";

export type SignUpFormProps = Readonly<{
    nicknameError: string | null;
    emailError: string | null;
    passwordError: string | null;
    redirectTo: string | null;
}>;

export const SignUpForm: React.FC<SignUpFormProps> = ({
    nicknameError,
    emailError,
    passwordError,
    redirectTo,
}) => {
    const [searchParams] = useSearchParams();
    const nicknameRef = React.useRef<HTMLInputElement>(null);
    const emailRef = React.useRef<HTMLInputElement>(null);
    const passwordRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        if (nicknameError) {
            nicknameRef.current?.focus();
        } else if (emailError) {
            emailRef.current?.focus();
        } else if (passwordError) {
            passwordRef.current?.focus();
        }
    }, [emailError, nicknameError, passwordError]);

    return (
        <Form method="post" action="/join" className="space-y-6">
            <div>
                <label
                    htmlFor="nickname"
                    className="block text-sm font-medium text-gray-700"
                >
                    Nickname
                </label>
                <div className="mt-1">
                    <input
                        ref={nicknameRef}
                        id="nickname"
                        required
                        autoFocus={true}
                        name="nickname"
                        type="text"
                        autoComplete="nickname"
                        aria-invalid={nicknameError ? true : undefined}
                        aria-describedby="email-error"
                        className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
                    />
                    {nicknameError && (
                        <div className="pt-1 text-red-700" id="email-error">
                            {nicknameError}
                        </div>
                    )}
                </div>
            </div>
            <div>
                <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                >
                    Email address
                </label>
                <div className="mt-1">
                    <input
                        ref={emailRef}
                        id="email"
                        required
                        autoFocus={true}
                        name="email"
                        type="email"
                        autoComplete="email"
                        aria-invalid={emailError ? true : undefined}
                        aria-describedby="email-error"
                        className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
                    />
                    {emailError && (
                        <div className="pt-1 text-red-700" id="email-error">
                            {emailError}
                        </div>
                    )}
                </div>
            </div>

            <div>
                <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                >
                    Password
                </label>
                <div className="mt-1">
                    <input
                        id="password"
                        ref={passwordRef}
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        aria-invalid={passwordError ? true : undefined}
                        aria-describedby="password-error"
                        className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
                    />
                    {passwordError && (
                        <div className="pt-1 text-red-700" id="password-error">
                            {passwordError}
                        </div>
                    )}
                </div>
            </div>

            {redirectTo && (
                <input type="hidden" name="redirectTo" value={redirectTo} />
            )}
            <button
                type="submit"
                className="w-full rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
            >
                Create Account
            </button>
            <div className="flex items-center justify-center">
                <div className="text-center text-sm text-gray-500">
                    Already have an account?{" "}
                    <Link
                        className="text-blue-500 underline"
                        to={{
                            pathname: "/login",
                            search: searchParams.toString(),
                        }}
                    >
                        Log in
                    </Link>
                </div>
            </div>
        </Form>
    );
};

export type LogoutFormProps = Readonly<{
    element?: React.ReactNode;
}>;
export const LogoutForm: React.FC<LogoutFormProps> = ({ element }) => {
    return (
        <Form action="/logout" method="post">
            {element ? (
                element
            ) : (
                <Button variant="text" type="submit">
                    Log out
                </Button>
            )}
        </Form>
    );
};
