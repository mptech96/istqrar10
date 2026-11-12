import { Visit } from "@/types/visit";
import api from "./index";
import { PaginatedResponse } from "@/types/paginated-response";
type visitsQueryArgs = {
  searchQuery?: string;
  page?: number;
  per_page?: number;
  branch_id?: number;
};
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
    getVisitsSelect: build.infiniteQuery<
      PaginatedResponse<Visit>,
      visitsQueryArgs,
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
        url: "/visits",
        method: "GET",
        params: {
          page: pageParam,
          search: queryArg.searchQuery ?? "",
          per_page: queryArg.per_page ?? 10,
          page_size: queryArg.per_page ?? 10,
          branch_id: queryArg.branch_id,
        },
      }),
      providesTags: ["Visits"],
    }),
    getVisitById: build.query({
      query: (id: string | number) => `/visits/${id}`,
      providesTags: ["Visits"],
    }),
    startVisit: build.mutation({
      query: ({ id, data }) => ({
        url: `visits/${id}/start`,
        method: "post",
        body: data,
      }),
      invalidatesTags: ["Visits"],
    }),
    editVisit: build.mutation({
      query: ({ id, data }) => ({
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
      invalidatesTags: ["Visits"],
    }),
    getVisitQuestions: build.query({
      query: ({
        id,
        page = 1,
        per_page = 15,
      }: {
        id: number;
        page?: number;
        per_page?: number;
      }) => ({
        url: `/visits/${id}/questions?page=${page}&per_page=${per_page}`,
        method: "GET",
      }),
      providesTags: ["Questions"],
    }),
    answerQuestionnaire: build.mutation({
      query: ({ visitId, data }) => ({
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
    closeVisit: build.mutation({
      query: ({ id, data }) => ({
        url: `/visits/${id}/complete`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Visits"],
    }),
    getVisitReport: build.query({
      query: (id: string) => `/visits/${id}/analysis`,
      providesTags: ["VisitReport"],
    }),
    getVisitAIAnalysis: build.query({
      query: (id: string) => `/visits/${id}/deep-analysis/latest`,
      providesTags: (result, error, id) => [{ type: "VisitAIAnalysis", id }],
    }),
    createVisitAIAnalysis: build.mutation({
      query: ({ id, data }) => ({
        url: `/visits/${id}/deep-analysis`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "VisitAIAnalysis", id },
      ],
    }),
  }),
});

export const {
  useCreateVisitMutation,
  useGetVisitsQuery,
  useGetVisitByIdQuery,
  useStartVisitMutation,
  useEditVisitMutation,
  useGetVisitsSelectInfiniteQuery,
  useDeleteVisitMutation,
  useGetVisitQuestionsQuery,
  useAnswerQuestionnaireMutation,
  useUpdateVisitMutation,
  useGetBranchVisitsQuery,
  useCloseVisitMutation,
  useGetVisitReportQuery,
  useGetVisitAIAnalysisQuery,
  useCreateVisitAIAnalysisMutation,
} = visitsApi;
