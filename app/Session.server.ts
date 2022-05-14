import { pipe } from "fp-ts/lib/function";
import * as T from "fp-ts/lib/Task";
import * as TE from "fp-ts/lib/TaskEither";
import * as O from "fp-ts/lib/Option";
import type { Session } from "@remix-run/node";
import { createCookieSessionStorage, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

import type { User } from "~/models/User.server";
import { getUserById } from "~/models/User.server";
import type { PrismaError } from "~/vendor/Prisma";
import { isPrismaError } from "~/vendor/Prisma";

invariant(process.env.SESSION_SECRET, "SESSION_SECRET must be set");

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    maxAge: 0,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});

const USER_SESSION_KEY = "userId";

export function getSession(request: Request): T.Task<Session> {
  return () => {
    const cookie = request.headers.get("Cookie");
    return sessionStorage.getSession(cookie);
  };
}

export function getUserId(request: Request): T.Task<string | null> {
  return pipe(
    request,
    getSession,
    T.map((session) => session.get(USER_SESSION_KEY)),
    T.map((userId) => {
      if (userId) {
        return userId;
      }
      return null;
    })
  );
}

export function getUser(
  request: Request
): TE.TaskEither<PrismaError | Response, User | null> {
  return TE.tryCatch(
    async () => {
      const userId = await getUserId(request)();
      if (userId === null) {
        return null;
      }

      const user = await pipe(
        getUserById(userId),
        TE.getOrElse((error) => {
          throw error;
        })
      )();
      if (user) {
        return user;
      }

      throw await logout(request);
    },
    (reason) => {
      if (isPrismaError(reason)) {
        return reason;
      }
      return reason as Response;
    }
  );
}

export function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
): TE.TaskEither<Response, string> {
  return pipe(
    request,
    getUserId,
    TE.fromTask,
    TE.chain((userId): TE.TaskEither<Response, string> => {
      if (!userId) {
        const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
        return TE.left(redirect(`/login?${searchParams}`));
      }
      return TE.right(userId);
    })
  );
}

export function requireUser(
  request: Request
): TE.TaskEither<Response | PrismaError, User> {
  return pipe(
    request,
    requireUserId,
    TE.chainW(getUserById),
    TE.chainW((user) => {
      return pipe(
        user,
        O.fromNullable,
        O.map((user) => TE.right(user)),
        O.getOrElse(() => {
          return pipe(
            request,
            logout,
            TE.fromTask,
            TE.chain((response) => {
              return TE.left(response);
            })
          );
        })
      );
    })
  );
}

export function createUserSession({
  request,
  userId,
  remember,
  redirectTo,
}: Readonly<{
  request: Request;
  userId: string;
  remember: boolean;
  redirectTo: string;
}>): T.Task<Response> {
  return pipe(
    T.Do,
    T.bind("session", () => getSession(request)),
    T.bind("cookie", ({ session }) => {
      return () => {
        session.set(USER_SESSION_KEY, userId);
        return sessionStorage.commitSession(session, {
          maxAge: remember
            ? 60 * 60 * 24 * 7 // 7 days
            : undefined,
        });
      };
    }),
    T.map(({ cookie }) =>
      redirect(redirectTo, {
        headers: { "Set-Cookie": cookie },
      })
    )
  );
}

export function logout(request: Request): T.Task<Response> {
  return pipe(
    request,
    getSession,
    T.chain((session) => () => sessionStorage.destroySession(session)),
    T.map((cookie) => {
      return redirect("/", {
        headers: {
          "Set-Cookie": cookie,
        },
      });
    })
  );
}
