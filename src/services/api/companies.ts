import api from "./index";

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
    getCompanies: build.query({
      query: (query: string) => `/companies?${query}`,
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
  }),
});

export const { useCreateCompanyMutation, useGetCompaniesQuery, useGetCompanyStatisticsQuery, useUpdateCompanyMutation } = companiesApi;
