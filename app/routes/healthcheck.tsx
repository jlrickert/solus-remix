// learn more: https://fly.io/docs/reference/configuration/#services-http_checks
import * as TE from "fp-ts/lib/TaskEither";
import type { LoaderFunction } from "@remix-run/node";

import { userCount } from "~/models/user.server";
import { pipe } from "fp-ts/lib/function";

export const loader: LoaderFunction = async ({ request }) => {
  const host =
    request.headers.get("X-Forwarded-Host") ?? request.headers.get("host");

  try {
    const url = new URL("/", `http://${host}`);
    // if we can connect to the database and make a simple query
    // and make a HEAD request to ourselves, then we're good.
    await Promise.all([
      await pipe(
        userCount(),
        TE.getOrElse((reason) => {
          throw reason;
        })
      )(),
      fetch(url.toString(), { method: "HEAD" }).then((r) => {
        if (!r.ok) return Promise.reject(r);
      }),
    ]);
    return new Response("OK");
  } catch (error: unknown) {
    console.log("healthcheck ❌", { error });
    return new Response("ERROR", { status: 500 });
  }
};
