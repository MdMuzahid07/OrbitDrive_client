import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

const url = `${baseUrl}/api/v1`;

const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: url,
    credentials: "include",
  }),
  tagTypes: ["Nodes", "User"],
  endpoints: () => ({}),
});

export default baseApi;
