import api from "./index";
import { Checklist } from "@/types/checklist";
import { PaginatedResponse } from "@/types/paginated-response";

type ChecklistsSelectQueryArgs = {
  searchQuery?: string;
  per_page?: number;
  company_id?: number;
};

export const checklistsApi = api.injectEndpoints({
  endpoints: (build) => ({
    createChecklist: build.mutation({
      query: (data) => ({
        url: "/checklists",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Checklists"],
    }),
    getChecklists: build.query({
      query: (query: string) => `/checklists?${query}`,
      providesTags: ["Checklists"],
    }),
    getChecklistsSelect: build.infiniteQuery<
      PaginatedResponse<Checklist>,
      ChecklistsSelectQueryArgs,
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
        url: "/checklists",
        method: "GET",
        params: {
          page: pageParam,
          search: queryArg.searchQuery ?? "",
          per_page: queryArg.per_page ?? 10,
          page_size: queryArg.per_page ?? 10,
          company_id: queryArg.company_id,
        },
      }),
      providesTags: ["Checklists"],
    }),
    updateChecklist: build.mutation({
      query: ({ id, data }) => ({
        url: `/checklists/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Checklists"],
    }),
    deleteChecklist: build.mutation({
      query: (id: number) => ({
        url: `/checklists/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Checklists"],
    }),
  }),
});

export const {
  useCreateChecklistMutation,
  useGetChecklistsQuery,
  useGetChecklistsSelectInfiniteQuery,
  useUpdateChecklistMutation,
  useDeleteChecklistMutation,
} = checklistsApi;
