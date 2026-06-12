import { baseApi } from '@shared/api/baseApi';
import { LoginInput } from '../schemas/loginSchema';
import { StartRegistrationInput, CompleteRegistrationInput } from '../schemas/registrationSchemas';

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: 'USER' | 'ADMIN';
  };
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginInput>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),
    startRegistration: builder.mutation<{ message: string }, StartRegistrationInput>({
      query: (body) => ({
        url: '/auth/start-registration',
        method: 'POST',
        body,
      }),
    }),
    verifyEmail: builder.mutation<{ registrationToken: string }, { token: string }>({
      query: (body) => ({
        url: '/auth/verify-email',
        method: 'POST',
        body,
      }),
    }),
    completeRegistration: builder.mutation<
      { user: any },
      { registrationToken: string } & CompleteRegistrationInput
    >({
      query: ({ registrationToken, ...body }) => ({
        url: '/auth/complete-registration',
        method: 'POST',
        headers: {
          'x-registration-token': registrationToken,
        },
        body,
      }),
      invalidatesTags: ['Auth'],
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),
    refresh: builder.mutation<{ user: any }, void>({
      query: () => ({
        url: '/auth/refresh',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),
    getMe: builder.query<{ user: any }, void>({
      query: () => ({
        url: '/auth/me',
        method: 'GET',
      }),
      providesTags: ['Auth'],
    }),
  }),
});

export const {
  useLoginMutation,
  useStartRegistrationMutation,
  useVerifyEmailMutation,
  useCompleteRegistrationMutation,
  useLogoutMutation,
  useRefreshMutation,
  useGetMeQuery,
} = authApi;

