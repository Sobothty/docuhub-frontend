import { configureStore } from "@reduxjs/toolkit";
import { apiSlide } from "@/feature/apiSlice/apiSlice";
import { authApi } from "@/feature/apiSlice/authApi";
import { profileApi } from "@/feature/profileSlice/profileSlice";
import { papersApi } from "@/feature/paperSlice/papers";
import starSlice from "@/feature/star/StarSlice";
import { categoriesApi } from "@/feature/categoriesSlice/categoriesSlices";
import { mediaApi } from "@/feature/media/mediaSlice";
import { feedbackApi } from "@/feature/feedbackSlice/feedbackSlice";
import { usersApi } from "@/feature/users/usersSlice";
import { studentApi } from "@/feature/users/studentSlice";
import assignmentApi from "@/feature/adviserAssignment/AdviserAssignmentSlice";
import { commentsApi } from "@/feature/commentSlice/commentSlice";

export const store = configureStore({
  reducer: {
    // RTK Query API reducers - ONLY ONCE each
    [profileApi.reducerPath]: profileApi.reducer,
    [apiSlide.reducerPath]: apiSlide.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
    [papersApi.reducerPath]: papersApi.reducer,
    [starSlice.reducerPath]: starSlice.reducer,
    [mediaApi.reducerPath]: mediaApi.reducer,
    [feedbackApi.reducerPath]: feedbackApi.reducer, // REMOVED DUPLICATE
    [usersApi.reducerPath]: usersApi.reducer,
    [studentApi.reducerPath]: studentApi.reducer, // REMOVED DUPLICATE

    // by thong
    [assignmentApi.reducerPath]: assignmentApi.reducer,
    [commentsApi.reducerPath]: commentsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          // RTK Query internal actions for all reducerPaths used
          "api/executeMutation/pending",
          "api/executeMutation/fulfilled",
          "api/executeMutation/rejected",
          "api/executeQuery/pending",
          "api/executeQuery/fulfilled",
          "api/executeQuery/rejected",
          "apiSlide/executeMutation/pending",
          "apiSlide/executeMutation/fulfilled",
          "apiSlide/executeMutation/rejected",
          "apiSlide/executeQuery/pending",
          "apiSlide/executeQuery/fulfilled",
          "apiSlide/executeQuery/rejected",
          "authApi/executeMutation/pending",
          "authApi/executeMutation/fulfilled",
          "authApi/executeMutation/rejected",
          "authApi/executeQuery/pending",
          "authApi/executeQuery/fulfilled",
          "authApi/executeQuery/rejected",
          "papersApi/executeMutation/pending",
          "papersApi/executeMutation/fulfilled",
          "papersApi/executeMutation/rejected",
          "papersApi/executeQuery/pending",
          "papersApi/executeQuery/fulfilled",
          "papersApi/executeQuery/rejected",
          "starSlice/executeMutation/pending",
          "starSlice/executeMutation/fulfilled",
          "starSlice/executeMutation/rejected",
          "starSlice/executeQuery/pending",
          "starSlice/executeQuery/fulfilled",
          "starSlice/executeQuery/rejected",
        ],
      },
    }).concat(
      apiSlide.middleware,
      authApi.middleware,
      profileApi.middleware,
      papersApi.middleware,
      starSlice.middleware,
      categoriesApi.middleware,
      mediaApi.middleware,
      feedbackApi.middleware, // ONLY ONCE
      usersApi.middleware,
      studentApi.middleware, // ONLY ONCE
      assignmentApi.middleware,
      commentsApi.middleware
    ),
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;