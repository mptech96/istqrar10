import api from "./index";

export const inspectorsApi = api.injectEndpoints({
  endpoints: (build) => ({
    createInspector: build.mutation({
      query: (data) => ({
        url: "/users",
        method: "POST",
        body: data,
      }),
    }),
    getInspectors: build.query({
      query: (query: string) => `/users?${query}`,
    }),
  }),
});

export const { useCreateInspectorMutation, useGetInspectorsQuery } = inspectorsApi;
