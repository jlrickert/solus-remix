import type { User } from "@prisma/client";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "~/Store";
import type { Theme, Profile } from "./Profile";

export type ProfileState = Readonly<{
    profile: Profile | null;
    status: "idle" | "loading" | "failed" | "success";
}>;

const initialState: ProfileState = {
    profile: null,
    status: "idle",
};

export const loadProfileAsync = createAsyncThunk(
    "/profile/loadProfile",
    async (userId: User["id"]): Promise<Profile> => {
        return {
            createdAt: new Date(),
            nickname: null,
            theme: "system",
            userId,
            updatedAt: new Date(),
        };
    }
);

export const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        // loadProfile: (state, action) => {},
        setTheme: (state, action: PayloadAction<Theme>) => {
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

// export const {} = profileSlice.actions;
export const selectProfile = (state: RootState) => state.profile.profile;
export const reducer = profileSlice.reducer;
