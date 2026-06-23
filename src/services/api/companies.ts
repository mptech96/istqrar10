import api from "./index";
import { Company } from "@/types/company";
import { PaginatedResponse } from "@/types/paginated-response";

type CompaniesQueryArgs = {
  searchQuery?: string;
  page?: number;
  per_page?: number;
};

type CompaniesSelectQueryArgs = {
  searchQuery?: string;
  per_page?: number;
};

export const companiesApi = api.injectEndpoints({
  endpoints: (build) => ({
    createCompany: build.mutation({
      query: (data) => ({
        url: "/companies",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Companies"],
    }),
    // Existing callers treat this endpoint as both paginated and array-like.
    // Keep the legacy hook loose; use getCompaniesSelect for typed select data.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getCompanies: build.query<any, CompaniesQueryArgs | string | void>({
      query: (args) => {
        if (typeof args === "string") {
          return {
            url: args ? `/companies?${args}` : "/companies",
            method: "GET",
          };
        }

        const { searchQuery = "", page = 1, per_page = 10 } =
          args ?? {};

        return {
          url: "/companies",
          method: "GET",
          params: {
            page,
            search: searchQuery,
            per_page,
          },
        };
      },

      providesTags: ["Companies"],
    }),
    getCompaniesSelect: build.infiniteQuery<
      PaginatedResponse<Company>,
      CompaniesSelectQueryArgs,
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
        url: "/companies",
        method: "GET",
        params: {
          page: pageParam,
          search: queryArg.searchQuery ?? "",
          per_page: queryArg.per_page ?? 10,
          page_size: queryArg.per_page ?? 10,
        },
      }),
      providesTags: ["Companies"],
    }),
    getCompanyStatistics: build.query({
      query: (companyId: number) => `/companies/${companyId}/statistics`,
    }),
    updateCompany: build.mutation({
      query: ({ id, data }) => ({
        url: `/companies/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Companies"],
    }),
    activateCompany: build.mutation({
      query: (companyId: number) => ({
        url: `/companies/${companyId}/active`,
        method: "PATCH",
      }),
      invalidatesTags: ["Companies"],
    }),
    deactivateCompany: build.mutation({
      query: (companyId: number) => ({
        url: `/companies/${companyId}/unactive`,
        method: "PATCH",
      }),
      invalidatesTags: ["Companies"],
    }),
    deleteCompany: build.mutation({
      query: (companyId: number) => ({
        url: `/companies/${companyId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Companies"],
    }),
  }),
});

export const {
  useCreateCompanyMutation,
  useGetCompaniesQuery,
  useGetCompaniesSelectInfiniteQuery,
  useGetCompanyStatisticsQuery,
  useUpdateCompanyMutation,
  useActivateCompanyMutation,
  useDeactivateCompanyMutation,
  useDeleteCompanyMutation,
} = companiesApi;
