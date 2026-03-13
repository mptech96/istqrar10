import api from "./index";

export const branchesApi = api.injectEndpoints({
  endpoints: (build) => ({
    createBranch: build.mutation({
      query: (data) => ({
        url: "/branches",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Branches"],
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
    }),
    getBranchById: build.query({
      query: (id: string | number) => `/branches/${id}`,
      providesTags: ["Branches"],
    }),
    updateBranch:build.mutation({
      query: ({ id, data }) => ({
        url: `/branches/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Branches"],
    }),
  }),
});

export const { useCreateBranchMutation, useGetBranchesQuery ,useGetBranchStatsQuery,useUpdateBranchMutation ,useGetBranchByIdQuery} = branchesApi;
