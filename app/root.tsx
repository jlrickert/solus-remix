import * as TE from "fp-ts/lib/TaskEither";
import { pipe } from "fp-ts/lib/function";
import type {
	LinksFunction,
	LoaderFunction,
	MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from "@remix-run/react";

import type { User } from "~/vendor/prisma";

import tailwindStylesheetUrl from "./styles/tailwind.css";
import { getUser } from "./session.server";

export const links: LinksFunction = () => {
	return [{ rel: "stylesheet", href: tailwindStylesheetUrl }];
};

export const meta: MetaFunction = () => ({
	charset: "utf-8",
	title: "Remix Notes",
	viewport: "width=device-width,initial-scale=1",
});

type LoaderData = {
	user: User | null;
};

export const loader: LoaderFunction = async ({ request }) => {
	const runTask = pipe(
		getUser(request),
		TE.getOrElse((reason) => {
			throw reason;
		})
	);
	return json<LoaderData>({
		user: await runTask(),
	});
};

export default function App() {
	return (
		<html lang="en" className="h-full">
			<head>
				<Meta />
				<Links />
			</head>
			<body className="h-full">
				<Outlet />
				<ScrollRestoration />
				<Scripts />
				<LiveReload />
			</body>
		</html>
	);
}
