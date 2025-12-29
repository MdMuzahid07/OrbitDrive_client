import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const url = "http://localhost:5000/api/v1/filesystem";

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
