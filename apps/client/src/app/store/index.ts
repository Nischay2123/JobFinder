import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { baseApi } from '../../shared/api/baseApi';
import authReducer from '@features/auth/store/authSlice';
import profileReducer from '@features/profile/store/profileSlice';

export const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
    profile: profileReducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

// Subscribe to store updates to persist onboarding profile state
store.subscribe(() => {
  try {
    const state = store.getState();
    if (!state.auth.isAuthenticated) {
      sessionStorage.removeItem('jobfinder_onboarding_state');
    } else {
      sessionStorage.setItem('jobfinder_onboarding_state', JSON.stringify(state.profile));
    }
  } catch (e) {
    console.error('Failed to save onboarding state to sessionStorage', e);
  }
});

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
