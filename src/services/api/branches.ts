import api from "./index";

export const branchesApi = api.injectEndpoints({
  endpoints: (build) => ({
    createBranch: build.mutation({
      query: (data) => ({
        url: "/branches",
        method: "POST",
        body: data,
      }),
    }),
    getBranches: build.query({
      query: (query: string) => `/branches?${query}`,
    }),
  }),
});

export const { useCreateBranchMutation, useGetBranchesQuery } = branchesApi;
