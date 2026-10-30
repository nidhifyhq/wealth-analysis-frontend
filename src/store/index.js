
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import authReducer from "./auth/auth.slice";
import uiReducer from "./ui/ui.slice";
import epfReducer from "./epf/epf.slice";

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["isAuthenticated", "authToken", "userId", "name", "email", "pinHash", "isPinSet", "isAdmin", "showBalance"]
};

const epfPersistConfig = {
  key: "epf",
  storage,
  whitelist: ["summaryData"]
};

const persistedAuthReducer = persistReducer(
  authPersistConfig,
  authReducer
);

const persistedEpfReducer = persistReducer(
  epfPersistConfig,
  epfReducer
);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    ui: uiReducer,
    epf: persistedEpfReducer
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export const persistor = persistStore(store);
