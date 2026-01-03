import { configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./features/auth/auth.slice";
import fileSystemApi from "./features/fileSystem/fileSystem.api";
import fileSystemSlice from "./features/fileSystem/fileSystem.slice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "filesystem"],
};

const authPersistConfig = {
  key: "auth",
  storage,
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedFileSystemReducer = persistReducer(
  persistConfig,
  fileSystemSlice,
);

export const store = configureStore({
  reducer: {
    [fileSystemApi.reducerPath]: fileSystemApi.reducer,
    filesystem: persistedFileSystemReducer,
    auth: persistedAuthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(fileSystemApi.middleware),
});

const persistor = persistStore(store);
export default persistor;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
