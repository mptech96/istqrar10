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
      providesTags: ["Users"],
    }),
    activateUser: build.mutation({
      query: (id) => ({
        url: `/users/${id}/active`,
        method: "PATCH",
      }),
      invalidatesTags: ["Users"],
    }),
    deactivateUser: build.mutation({
      query: (id) => ({
        url: `/users/${id}/unactive`,
        method: "PATCH",
      }),
      invalidatesTags: ["Users"],
    }),
    updateInspector: build.mutation({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),
    deleteUser: build.mutation({
      query: (id: number) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const { useCreateInspectorMutation, useGetInspectorsQuery, useUpdateInspectorMutation, useActivateUserMutation, useDeactivateUserMutation,useDeleteUserMutation } = inspectorsApi;
