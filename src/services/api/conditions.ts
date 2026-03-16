
import api from "./index";
const conditionsApi = api.injectEndpoints({
  endpoints: (build) => ({
    createCondition: build.mutation({
      query: ({checklistId, data}) => ({
        url: `/checklists/${checklistId}/questions`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Checklists"],
    }),
    getAllConditions: build.query({
      query: ({ checklistId }) => `/checklists/${checklistId}/questions`,
      providesTags: ["Questions"],
    }),
    updateCondition: build.mutation({
      query: ({ checklistId, questionId, data }) => ({
        url: `/checklists/${checklistId}/questions/${questionId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Questions"],
    }),
    deleteCondition: build.mutation({
      query: ({ checklistId, questionId }) => ({
        url: `/checklists/${checklistId}/questions/${questionId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Questions"],
    }),
  }),
});

export const { useCreateConditionMutation, useGetAllConditionsQuery, useUpdateConditionMutation ,useDeleteConditionMutation } = conditionsApi;