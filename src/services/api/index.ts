import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const Base_URL = process.env.NEXT_PUBLIC_BASE_URL;
console.log(Base_URL);
const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: Base_URL,
    prepareHeaders: (headers) => {
      const user = JSON.parse(localStorage.getItem("user") as string);
      if (user) {
        headers.set("Authorization", `Bearer ${user.token}`);
        headers.set("Accept", "application/json");
      }
      return headers;
    },
  }),
  endpoints: () => ({}),
  tagTypes: [],
});

export default api;
