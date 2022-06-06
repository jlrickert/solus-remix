import {
    buildCreateApi,
    coreModule,
    reactHooksModule,
    fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

export const createApi = buildCreateApi(
    coreModule(),
    reactHooksModule({ unstable__sideEffectsInRender: true })
);

export { fetchBaseQuery };
