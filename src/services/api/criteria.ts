import api from "./index";

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
    updateCriteria: build.mutation({
      query: ({ id, data }) => ({
        url: `/criterias/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Criterias"],
    }),
  }),
});

export const { useCreateCriteriaMutation, useGetCriteriaQuery, useUpdateCriteriaMutation } = criteriaApi;
