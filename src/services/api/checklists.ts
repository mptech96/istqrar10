import api from "./index";

export const checklistsApi = api.injectEndpoints({
  endpoints: (build) => ({
    createChecklist: build.mutation({
      query: (data) => ({
        url: "/checklists",
        method: "POST",
        body: data,
      }),
    }),
    getChecklists: build.query({
      query: (query: string) => `/checklists?${query}`,
    }),
  }),
});

export const { useCreateChecklistMutation, useGetChecklistsQuery } = checklistsApi;
