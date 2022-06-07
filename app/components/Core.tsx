import * as React from "react";
import type { LinkProps } from "@remix-run/react";
import { Link } from "@remix-run/react";
import { absurd } from "fp-ts/lib/function";

type ButtonStyle = Readonly<{
    variant: "text" | "contained" | "outlined";
    color: "default" | "primary" | "warning" | "danger";
}>;
const textColorMap: { [K in ButtonStyle["color"]]: string } = {
    default: "",
    primary: "bg-blue-500",
    warning: "",
    danger: "",
};

const containedColorMap: { [K in ButtonStyle["color"]]: string } = {
    danger: "",
    default:
        "text-zinc-100 py-2 bg-slate-500 hover:bg-blue-600 active:bg-blue-600",
    primary:
        "text-zinc-100 py-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-500",
    warning: "",
};

const getVariantStyle = (
    variant: ButtonStyle["variant"],
    color: ButtonStyle["color"]
) => {
    const value = variant ?? "contained";
    const textColor = "text-zinc-100";
    switch (value) {
        case "text": {
            return `bg-transparent ${textColor} border-transparent border-t-4 hover:border-blue-600`;
        }
        case "contained": {
            return containedColorMap[color];
        }
        case "outlined": {
            return "bg-transparent border-solid py-2 hover:bg-blue-500 active:bg-blue-600";
        }
        default: {
            return absurd(value);
        }
    }
};
const buttonStyle = (props: ButtonStyle) => {
    return `flex items-center justify-center ${getVariantStyle(
        props.variant,
        props.color
    )} px-4`;
};

export type ButtonProps = Readonly<
    JSX.IntrinsicElements["button"] & Partial<ButtonStyle>
>;

export const Button: React.FC<ButtonProps> = ({ variant, color, ...props }) => {
    return (
        <button
            {...props}
            className={`
            ${buttonStyle({
                color: color ?? "default",
                variant: variant ?? "contained",
            })} ${props.className ?? ""}`}
        >
            {props.children}
        </button>
    );
};

export type IconButtonProps = Readonly<
    JSX.IntrinsicElements["button"] & Partial<ButtonStyle>
>;
export const IconButton: React.FC<IconButtonProps> = (props) => {
    return (
        <button
            {...props}
            className="rounded-full p-1 text-zinc-100 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-blue-800"
        />
    );
};

export type LinkButtonProps = Readonly<LinkProps & Partial<ButtonStyle>>;
export const LinkButton: React.FC<LinkButtonProps> = ({
    variant,
    color,
    ...props
}) => {
    return (
        <Link
            {...props}
            className={`${buttonStyle({
                color: color ?? "default",
                variant: variant ?? "contained",
            })} ${props.className ?? ""}`}
        >
            {props.children}
        </Link>
    );
};
