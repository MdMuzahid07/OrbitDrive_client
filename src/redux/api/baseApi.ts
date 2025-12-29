import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const url =
  process.env.NEXT_PUBLIC_ENVIRONMENT === "production"
    ? process.env.NEXT_PUBLIC_BACKEND_URL
    : "http://localhost:5000/api/v1";

const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: url,
    credentials: "include",
  }),
  tagTypes: ["Nodes"],
  endpoints: () => ({}),
});

export default baseApi;
