import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import carListingsReducer from './slices/carListingsSlice';
import dashboardReducer from './slices/dashboardSlice';
import usersReducer from './slices/usersSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    carListings: carListingsReducer,
    users: usersReducer,
    dashboard: dashboardReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

export type { AppDispatch, RootState };
