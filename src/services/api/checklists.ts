import api from "./index";

export const checklistsApi = api.injectEndpoints({
  endpoints: (build) => ({
    createChecklist: build.mutation({
      query: (data) => ({
        url: "/checklists",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Checklists"],
    }),
    getChecklists: build.query({
      query: (query: string) => `/checklists?${query}`,
      providesTags: ["Checklists"],
    }),
    updateChecklist: build.mutation({
      query: ({ id, data }) => ({
        url: `/checklists/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Checklists"],
    }),
    deleteChecklist: build.mutation({
      query: (id: number) => ({
        url: `/checklists/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Checklists"],
    }),
  }),
});

export const { useCreateChecklistMutation, useGetChecklistsQuery, useUpdateChecklistMutation ,useDeleteChecklistMutation } = checklistsApi;
