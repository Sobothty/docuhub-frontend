import { configureStore } from "@reduxjs/toolkit";
import { apiSlide } from "@/feature/apiSlice/apiSlice";
import { authApi } from "@/feature/apiSlice/authApi";
import adviserDetailReducer from "@/feature/adviserSlice/adviserDetailSlice";
import categoryReducer from "@/feature/categorySlice";
import userReducer from "@/feature/users/userSlice";
import paperReducer from "@/feature/paperSlice/paperSlice";
import mediaReducer from "@/feature/mediaSlice/mediaSlice";
import { categoryApi } from "@/feature/apiSlice/categoryApiSlice";
import { profileApi } from "@/feature/profileSlice/profileSlice";
import { papersApi } from "@/feature/paperSlice/papers";
import starSlice from "@/feature/star/StarSlice";
import { categoriesApi } from "@/feature/categoriesSlice/categoriesSlices";
import { mediaApi } from "@/feature/media/mediaSlice";

export const store = configureStore({
  reducer: {
    adviserDetail: adviserDetailReducer,
    category: categoryReducer,
    user: userReducer,
    paper: paperReducer,
    media: mediaReducer,
    [profileApi.reducerPath]: profileApi.reducer,
    [apiSlide.reducerPath]: apiSlide.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
    [papersApi.reducerPath]: papersApi.reducer,
    [starSlice.reducerPath]: starSlice.reducer,
    [mediaApi.reducerPath]: mediaApi.reducer,
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
      categoryApi.middleware,
      profileApi.middleware,
      papersApi.middleware,
      starSlice.middleware,
      categoriesApi.middleware,
      mediaApi.middleware
    ),
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
