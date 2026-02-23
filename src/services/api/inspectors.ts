import api from "./index";

export const inspectorsApi = api.injectEndpoints({
  endpoints: (build) => ({
    createInspector: build.mutation({
      query: (data) => ({
        url: "/users",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),
    getInspectors: build.query({
      query: (query: string) => `/users?${query}`,
    }),
    updateInspector: build.mutation({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const { useCreateInspectorMutation, useGetInspectorsQuery, useUpdateInspectorMutation } = inspectorsApi;
