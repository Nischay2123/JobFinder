import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { logout, setCredentials } from '../../features/auth/store/authSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:5001/',
  credentials: 'include',
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const isRefreshRequest = typeof args === 'string'
      ? args.includes('/auth/refresh')
      : args.url.includes('/auth/refresh');

    if (!isRefreshRequest) {
      // Try to get a new access token via refresh token cookie
      const refreshResult = await baseQuery(
        { url: '/auth/refresh', method: 'POST' },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        const data = refreshResult.data as any;
        // Store the user details in Redux
        api.dispatch(
          setCredentials({
            user: data.user,
          })
        );
        // Retry the original query
        result = await baseQuery(args, api, extraOptions);
      } else {
        // If refresh fails, log the user out
        api.dispatch(logout());
      }
    }
  }
  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Auth', 'User', 'Jobs'],
  endpoints: () => ({}),
});
