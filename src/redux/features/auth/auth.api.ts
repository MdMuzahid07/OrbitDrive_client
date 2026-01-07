/* eslint-disable @typescript-eslint/no-explicit-any */
import { AuthResponse } from "../../../types/auth";
import baseApi from "../../api/baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<any, any>({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
      transformResponse: (res: any) => res.data,
    }),
    login: builder.mutation<AuthResponse, any>({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
      transformResponse: (res: any) => res.data,
    }),
    logout: builder.mutation<any, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
    verifyEmail: builder.mutation<any, string>({
      query: (token) => ({
        url: `/auth/verify-email/${token}`,
        method: "GET",
      }),
    }),
    resendVerificationEmail: builder.mutation<any, { email: string }>({
      query: (data) => ({
        url: "/auth/resend-verification-email",
        method: "POST",
        body: data,
      }),
    }),
    forgotPassword: builder.mutation<any, { email: string }>({
      query: (data) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),
    resetPassword: builder.mutation<any, { token: string; body: any }>({
      query: ({ token, body }) => ({
        url: `/auth/reset-password/${token}`,
        method: "POST",
        body: body,
      }),
    }),
    getMe: builder.query<{ user: any }, void>({
      query: () => "/auth/me",
      providesTags: ["User"],
      transformResponse: (res: any) => res.data,
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useVerifyEmailMutation,
  useResendVerificationEmailMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetMeQuery,
} = authApi;

export default authApi;
