import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer, Persistor } from "redux-persist";
import authReducer from "@/features/auth/authSlice";
import currencySelectorReducer from "@/features/modal/currencySelectorSlice";
import secureStorage from "./storage";

const persistConfig = {
    key: "auth",
    storage: secureStorage,
    whitelist: ["auth"],
    keyPrefix: ""
};

const rootReducer = combineReducers({
    auth: authReducer,
    currencySelector: currencySelectorReducer,
    // ... other reducers can go here
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        }), 
});

export const persistor: Persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;