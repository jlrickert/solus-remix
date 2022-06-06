import * as React from "react";
import type { LinkProps } from "@remix-run/react";
import { Link } from "@remix-run/react";

export const Button: React.FC<JSX.IntrinsicElements["button"]> = (props) => {
    return (
        <button
            {...props}
            className={`rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600 ${props.className}`}
        />
    );
};

export const LinkButton: React.FC<LinkProps> = (props) => {
    return (
        <Link
            {...props}
            className={`rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600 ${props.className}`}
        >
            {props.children}
        </Link>
    );
};
