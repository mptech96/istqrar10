import api from "./index";

export const companiesApi = api.injectEndpoints({
  endpoints: (build) => ({
    createCompany: build.mutation({
      query: (data) => ({
        url: "/companies",
        method: "POST",
        body: data,
      }),
    }),
    getCompanies: build.query({
      query: (query: string) => `/companies?${query}`,
    }),
    getCompanyStatistics: build.query({
      query: (companyId: number) => `/companies/${companyId}/statistics`,
    }),
  }),
});

export const { useCreateCompanyMutation, useGetCompaniesQuery, useGetCompanyStatisticsQuery } = companiesApi;
