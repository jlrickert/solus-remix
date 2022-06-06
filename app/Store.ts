import type { Action, ThunkAction } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import {
    profileApi,
    profileSlice,
    reducer as profileReducer,
} from "~/features/profile/ProfileSlice";
import { Profile } from "./features/profile/Profile";

export const store = configureStore({
    reducer: {
        profile: profileReducer,
        [profileApi.reducerPath]: profileApi.reducer,
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware().concat(profileApi.middleware);
    },
});

setupListeners(store.dispatch);

export const preloadedState = (state: RootState): RootState => ({
    ...state,
    profile: state.profile,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
