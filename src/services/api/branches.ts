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
    getBranchStats:build.query({
      query: (branchId:string) => ({
        url: `/branches/${branchId}/statistics`,
        method: "GET",
      }),
      providesTags:["branchStats"]
    })
  }),
});

export const { useCreateBranchMutation, useGetBranchesQuery ,useGetBranchStatsQuery } = branchesApi;
