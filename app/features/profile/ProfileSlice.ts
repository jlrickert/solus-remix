import type { User } from "@prisma/client";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "~/Store";
import * as Prisma from "~/vendor/Prisma";
import { createApi, fetchBaseQuery } from "~/vendor/CreateApi";

import * as ProfileRepo from "./ProfileRepo.server";
import * as Profile from "./Profile";

export type ProfileState = Readonly<{
    profile: Profile.Profile | null;
    status: "idle" | "loading" | "failed" | "success";
}>;

const initialState: ProfileState = {
    profile: null,
    status: "idle",
};

export const loadProfileAsync = createAsyncThunk(
    "/profile/loadProfile",
    async (userId: User["id"], x) => {
        const task = ProfileRepo.getProfileByUserId(userId);
        return await Prisma.forceRun(task);
    }
);

export const profileApi = createApi({
    reducerPath: "profileApi",
    baseQuery: fetchBaseQuery({ baseUrl: "/profiles" }),
    endpoints: (builder) => ({
        getProfileList: builder.query<Profile.Profile, string>({
            query: () => `/profiles`,
        }),
        getProfileByNickname: builder.query<Profile.Profile, string>({
            query: (nickname) => `/profiles/${nickname}`,
        }),
        updateProfile: builder.mutation({
            query: ({ id, ...patch }) => ({
                url: `profiles`,
                method: "PATCH",
                body: patch,
            }),
        }),
    }),
});

export const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        setTheme: (state, action: PayloadAction<Profile.Theme>) => {
            if (!state.profile) {
                return;
            }
            state.profile.theme = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadProfileAsync.pending, (state) => {
                state.status = "loading";
            })
            .addCase(loadProfileAsync.fulfilled, (state, action) => {
                state.profile = action.payload;
                state.status = "success";
            })
            .addCase(loadProfileAsync.rejected, (state) => {
                state.status = "failed";
            });
    },
});

export const { setTheme } = profileSlice.actions;
export const selectProfile = (state: RootState) => state.profile.profile;
export const selectTheme = (state: RootState) =>
    state.profile.profile?.theme ?? "system";
export const selectNickname = (state: RootState) =>
    state.profile.profile?.nickname ?? null;
export const reducer = profileSlice.reducer;
