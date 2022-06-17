import type { TaskEither } from "fp-ts/lib/TaskEither";
import * as TE from "fp-ts/lib/TaskEither";
import type { Lazy } from "fp-ts/lib/function";
import { pipe } from "fp-ts/lib/function";
import { absurd } from "fp-ts/lib/function";
import { Prisma } from "@prisma/client";
import type {
	PrismaClientInitializationError,
	PrismaClientKnownRequestError,
	PrismaClientRustPanicError,
	PrismaClientUnknownRequestError,
	PrismaClientValidationError,
} from "@prisma/client/runtime";

export type PrismaError =
	| PrismaClientInitializationError
	| PrismaClientKnownRequestError
	| PrismaClientRustPanicError
	| PrismaClientUnknownRequestError
	| PrismaClientValidationError;

export function isInitializationError(
	err: unknown
): err is Prisma.PrismaClientInitializationError {
	return err instanceof Prisma.PrismaClientInitializationError;
}

export function isKnownRequestError(
	err: unknown
): err is PrismaClientKnownRequestError {
	return err instanceof Prisma.PrismaClientKnownRequestError;
}

export function isRustPanicError(
	err: unknown
): err is PrismaClientRustPanicError {
	return err instanceof Prisma.PrismaClientRustPanicError;
}

export function isUnknownRequestError(
	err: unknown
): err is PrismaClientUnknownRequestError {
	return err instanceof Prisma.PrismaClientUnknownRequestError;
}

export function isValidationError(
	err: unknown
): err is PrismaClientValidationError {
	return err instanceof Prisma.PrismaClientValidationError;
}

export function isPrismaError(error: unknown): error is PrismaError {
	return (
		isInitializationError(error) ||
		isKnownRequestError(error) ||
		isRustPanicError(error) ||
		isUnknownRequestError(error) ||
		isValidationError(error)
	);
}

export function matchError<T>(
	matcher: Readonly<{
		initializationError: (error: PrismaClientInitializationError) => T;
		knownRequestError: (error: PrismaClientKnownRequestError) => T;
		rustPanicError: (error: PrismaClientRustPanicError) => T;
		unknownRequestError: (error: PrismaClientUnknownRequestError) => T;
		validationError: (error: PrismaClientValidationError) => T;
	}>
): (error: PrismaError) => T {
	return (error) => {
		if (isInitializationError(error)) {
			return matcher.initializationError(error);
		} else if (isKnownRequestError(error)) {
			return matcher.knownRequestError(error);
		} else if (isRustPanicError(error)) {
			return matcher.rustPanicError(error);
		} else if (isUnknownRequestError(error)) {
			return matcher.unknownRequestError(error);
		} else if (isValidationError(error)) {
			return matcher.validationError(error);
		}
		return absurd(error);
	};
}

export function convertToTaskEither<A>(
	f: Lazy<Promise<A>>
): TaskEither<PrismaError, A> {
	return TE.tryCatch(f, (reason) => {
		if (isPrismaError(reason)) {
			return reason;
		}
		throw reason;
	});
}

export function forceRun<A, E>(ma: TaskEither<E, A>): Promise<A> {
	return pipe(
		ma,
		TE.getOrElse((reason) => {
			throw reason;
		})
	)();
}

export * from "@prisma/client";
