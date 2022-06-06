import * as React from "react";

export type LayoutProps = Readonly<{
    navElement: JSX.Element;
    children: React.ReactElement;
}>;
export const Layout: React.FC<LayoutProps> = (props) => {
    return <div></div>;
};
