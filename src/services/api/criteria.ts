import api from "./index";
import { Criteria } from "@/types/criteria";
import { PaginatedResponse } from "@/types/paginated-response";

type CriteriaSelectQueryArgs = {
  searchQuery?: string;
  per_page?: number;
};

export const criteriaApi = api.injectEndpoints({
  endpoints: (build) => ({
    createCriteria: build.mutation({
      query: (data) => ({
        url: "/criterias",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Criterias"],
    }),
    getCriteria: build.query({
      query: (query: string) => `/criterias?${query}`,
      providesTags: ["Criterias"],
    }),
    getCriteriaSelect: build.infiniteQuery<
      PaginatedResponse<Criteria>,
      CriteriaSelectQueryArgs,
      number
    >({
      infiniteQueryOptions: {
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
          const { current_page, last_page } = lastPage.meta;

          return current_page < last_page
            ? current_page + 1
            : undefined;
        },
      },
      query: ({ queryArg, pageParam }) => ({
        url: "/criterias",
        method: "GET",
        params: {
          page: pageParam,
          search: queryArg.searchQuery ?? "",
          per_page: queryArg.per_page ?? 10,
          page_size: queryArg.per_page ?? 10,
        },
      }),
      providesTags: ["Criterias"],
    }),
    updateCriteria: build.mutation({
      query: ({ id, data }) => ({
        url: `/criterias/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Criterias"],
    }),
    deleteCriteria: build.mutation({
      query: (id: number) => ({
        url: `/criterias/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Criterias"],
    }),
  }),
});

export const {
  useCreateCriteriaMutation,
  useGetCriteriaQuery,
  useGetCriteriaSelectInfiniteQuery,
  useUpdateCriteriaMutation,
  useDeleteCriteriaMutation,
} = criteriaApi;
