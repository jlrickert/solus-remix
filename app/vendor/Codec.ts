import { pipe } from "fp-ts/lib/function";
import * as O from "fp-ts/lib/Option";
import * as T from "io-ts";
import { PathReporter } from "io-ts/PathReporter";
export * from "io-ts";

const isISO8601Date = (u: unknown): u is string => {
    return typeof u === "string" && !isNaN(Date.parse(u));
};
const isDate = (u: unknown): u is Date => {
    return u instanceof Date;
};

export const iso8601Date = new T.Type<Date, string, unknown>(
    "IS08601Date",
    (u): u is Date => isDate(u),
    (u, c) => {
        return pipe(
            u,
            O.fromPredicate(isISO8601Date),
            O.map((isoDate) => new Date(isoDate)),
            O.fold(
                () => T.failure<Date>(u, c),
                (date) => T.success(date)
            )
        );
    },
    (a) => `${a.toISOString()}`
);

export const getErrorMessages = (codec: T.Any) => (value: unknown) => {
    return pipe(value, codec.decode, PathReporter.report);
};
