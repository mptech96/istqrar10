import { Branch } from "@/types/branch";
import api from "./index";
import { PaginatedResponse } from "@/types/paginated-response";
type BranchesQueryArgs = {
  searchQuery?: string;
  page?: number;
  per_page?: number;
  company_id?: number;
};
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
    getBranchesSelect: build.infiniteQuery<
      PaginatedResponse<Branch>,
      BranchesQueryArgs,
      number
    >({
      infiniteQueryOptions: {
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
          const { current_page, last_page } = lastPage.meta;

          return current_page < last_page ? current_page + 1 : undefined;
        },
      },
      query: ({ queryArg, pageParam }) => ({
        url: "/branches",
        method: "GET",
        params: {
          page: pageParam,
          search: queryArg.searchQuery ?? "",
          per_page: queryArg.per_page ?? 10,
          page_size: queryArg.per_page ?? 10,
          company_id: queryArg.company_id ?? "",
        },
      }),
      providesTags: ["Branches"],
    }),
    getBranchStats: build.query({
      query: (branchId) => ({
        url: `/branches/${branchId}/statistics`,
        method: "GET",
      }),
      providesTags: ["branchStats"],
    }),
    getBranchById: build.query({
      query: (id: string | number) => `/branches/${id}`,
      providesTags: ["Branches"],
    }),
    updateBranch: build.mutation({
      query: ({ id, data }) => ({
        url: `/branches/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Branches"],
    }),
    activateBranch: build.mutation({
      query: (branchId: number) => ({
        url: `/branches/${branchId}/active`,
        method: "PATCH",
      }),
      invalidatesTags: ["Branches"],
    }),
    deactivateBranch: build.mutation({
      query: (branchId: number) => ({
        url: `/branches/${branchId}/unactive`,
        method: "PATCH",
      }),
      invalidatesTags: ["Branches"],
    }),
    deleteBranch: build.mutation({
      query: (branchId: number) => ({
        url: `/branches/${branchId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Branches"],
    }),
  }),
});

export const {
  useCreateBranchMutation,
  useGetBranchesQuery,
  useGetBranchStatsQuery,
  useUpdateBranchMutation,
  useGetBranchesSelectInfiniteQuery,
  useGetBranchByIdQuery,
  useActivateBranchMutation,
  useDeactivateBranchMutation,
  useDeleteBranchMutation,
} = branchesApi;
