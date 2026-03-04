import api from "./index";

export const visitsApi = api.injectEndpoints({
  endpoints: (build) => ({
    createVisit: build.mutation({
      query: (data) => ({
        url: "/visits",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Visits"],
    }),
    getVisits: build.query({
      query: (query: string) => `/visits?${query}`,
      providesTags: ["Visits"],
    }),
    startVisit: build.mutation({
      query: (id) => ({url:`visits/${id}/start`, method:"post"}),
      invalidatesTags: ["Visits"],
    }),
    editVisit: build.mutation({
      query: ({id, data}) => ({
        url: `/visits/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteVisit: build.mutation({
      query: (id: string) => ({
        url: `/visits/${id}`,
        method: "DELETE",
      }),
    }),
    getVisitQuestions: build.query({
      query: ({ id, page = 1, per_page = 15 }: { id: number; page?: number; per_page?: number }) => ({
        url: `/visits/${id}/questions?page=${page}&per_page=${per_page}`,
        method: "GET",
      }),
      providesTags: ["Questions"],
    }),
    answerQuestionnaire: build.mutation({
      query: ({visitId, data}) => ({
        url: `/visits/${visitId}/answers/bulk`,
        method: "POST",
        body: data,
      }),
    }),
    updateVisit: build.mutation({
      query: ({ id, data }) => ({
        url: `/visits/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Visits"],
    }),
    getBranchVisits: build.query({
      query: (branchId: string) => `/visits/branch/${branchId}`,
      providesTags: ["BranchVisits"],
    }),
  }),
});

export const { useCreateVisitMutation, useGetVisitsQuery,
   useStartVisitMutation, useEditVisitMutation, 
   useDeleteVisitMutation, useGetVisitQuestionsQuery, useAnswerQuestionnaireMutation, useUpdateVisitMutation,useGetBranchVisitsQuery } = visitsApi;
