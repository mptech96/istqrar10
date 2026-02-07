import api from "./index";

export const criteriaApi = api.injectEndpoints({
  endpoints: (build) => ({
    createCriteria: build.mutation({
      query: (data) => ({
        url: "/criterias",
        method: "POST",
        body: data,
      }),
    }),
    getCriteria: build.query({
      query: (query: string) => `/criterias?${query}`,
    }),
  }),
});

export const { useCreateCriteriaMutation, useGetCriteriaQuery } = criteriaApi;
