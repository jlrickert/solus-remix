import * as React from "react";
import { MainNavBar } from "./NavBar";

export type LayoutProps = Readonly<{
    navElement?: React.ReactNode;
    children?: React.ReactNode;
}>;
export const Layout: React.FC<LayoutProps> = (props) => {
    return (
        <div className="flex h-full min-h-screen flex-col">
            {props.navElement ?? <MainNavBar />}
            <main className="flex h-full bg-slate-900">{props.children}</main>
        </div>
    );
};
