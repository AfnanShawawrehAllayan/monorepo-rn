import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { persistStore, persistReducer } from 'redux-persist';

import { reduxStorage } from '../utils/storage';

import { api } from './api';
import { authReducer } from './slices/authSlice';

const persistConfig = {
  key: 'root',
  storage: reduxStorage,
  whitelist: ['auth'],
};

const persistedReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth: persistedReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(api.middleware),
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
