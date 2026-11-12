import { User } from "@/types/user";
import api from "./index";
import { PaginatedResponse } from "@/types/paginated-response";
type InspectorsQueryArgs = {
  searchQuery?: string;
  page?: number;
  per_page?: number;
  role?: string;
};
export const inspectorsApi = api.injectEndpoints({
  endpoints: (build) => ({
    createInspector: build.mutation({
      query: (data) => ({
        url: "/users",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),
    getInspectors: build.query({
      query: (query: string) => `/users?${query}`,
      providesTags: ["Users"],
    }),
    getAuditorsSelect: build.infiniteQuery<
      PaginatedResponse<User>,
      InspectorsQueryArgs,
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
        url: "/users",
        method: "GET",
        params: {
          page: pageParam,
          search: queryArg.searchQuery ?? "",
          per_page: queryArg.per_page ?? 10,
          page_size: queryArg.per_page ?? 10,
          role: queryArg.role ?? "",
        },
      }),
      providesTags: ["Auditors"],
    }),
    activateUser: build.mutation({
      query: (id) => ({
        url: `/users/${id}/active`,
        method: "PATCH",
      }),
      invalidatesTags: ["Users"],
    }),
    deactivateUser: build.mutation({
      query: (id) => ({
        url: `/users/${id}/unactive`,
        method: "PATCH",
      }),
      invalidatesTags: ["Users"],
    }),
    updateInspector: build.mutation({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),
    deleteUser: build.mutation({
      query: (id: number) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useCreateInspectorMutation,
  useGetAuditorsSelectInfiniteQuery,
  useGetInspectorsQuery,
  useUpdateInspectorMutation,
  useActivateUserMutation,
  useDeactivateUserMutation,
  useDeleteUserMutation,
} = inspectorsApi;
