import React, { useEffect, useState } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { store } from '../store';
import { setCredentials, authApi } from '@features/auth';

const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const [triggerGetMe] = authApi.useLazyGetMeQuery();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Fetch the user profile using the /me route.
        // If access token is missing/expired, baseQueryWithReauth will refresh it automatically.
        const meResponse = await triggerGetMe().unwrap();
        dispatch(
          setCredentials({
            user: meResponse.user,
          })
        );
      } catch (err) {
        // Ignored: silent refresh failed (no valid session cookie exists)
      } finally {
        setInitialized(true);
      }
    };
    initAuth();
  }, [triggerGetMe, dispatch]);

  if (!initialized) {
    return (
      <div className="dark min-h-screen bg-background text-text-primary flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-container border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <AuthInitializer>{children}</AuthInitializer>
    </Provider>
  );
};
