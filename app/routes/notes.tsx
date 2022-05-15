import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";

import { requireUserId } from "~/Session.server";
import { useUser } from "~/Utils";
import type { Note } from "~/models/Note.server";
import { getNoteListItems } from "~/models/Note.server";
import { forceRun } from "~/vendor/Prisma";
import { MainNavBar } from "~/components/NavBar";

type LoaderData = {
    noteListItems: readonly Pick<Note, "id" | "title">[];
};

export const loader: LoaderFunction = async ({ request }) => {
    const userId = await forceRun(requireUserId(request));
    const noteListItems = await forceRun(getNoteListItems({ userId }));
    return json<LoaderData>({ noteListItems });
};

export default function NotesPage() {
    const data = useLoaderData() as LoaderData;
    return (
        <div className="flex h-full min-h-screen flex-col">
            <MainNavBar />

            <main className="flex h-full bg-white">
                <div className="h-full w-80 border-r bg-gray-50">
                    <Link to="new" className="block p-4 text-xl text-blue-500">
                        + New Note
                    </Link>

                    <hr />

                    {data.noteListItems.length === 0 ? (
                        <p className="p-4">No notes yet</p>
                    ) : (
                        <ol>
                            {data.noteListItems.map((note) => (
                                <li key={note.id}>
                                    <NavLink
                                        className={({ isActive }) =>
                                            `block border-b p-4 text-xl ${
                                                isActive ? "bg-white" : ""
                                            }`
                                        }
                                        to={note.id}
                                    >
                                        📝 {note.title}
                                    </NavLink>
                                </li>
                            ))}
                        </ol>
                    )}
                </div>

                <div className="flex-1 p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
