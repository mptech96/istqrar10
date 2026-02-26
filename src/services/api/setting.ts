import api from "./index";

const settingApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSetting: builder.query({
      query: ({ page, per_page, group, search }) => ({
        url: "/settings",
        method: "GET",
        params: {
          page,
          per_page,
          group,
          search,
        },
      }),
      providesTags: ["Settings"],
    }),
    createSetting: builder.mutation({
      query: ({ body }) => ({
        url: "/settings",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Settings"],
    }),
    updateSetting: builder.mutation({
      query: ({ body, id }) => ({
        url: `/settings/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Settings"],
    }),
    getAllSettingGroup: builder.query({
      query: () => ({
        url: "/settings/groups",
        method: "GET",
      }),
    }),
    getSettingGroup: builder.query({
      query: () => ({
        url: "/settings/group",
        method: "GET",
      }),
    }),
    updateSettingBulk: builder.mutation({
      query: ({ body }) => ({
        url: "/settings/bulk",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Settings"],
    }),
    exportSetting: builder.query({
      query: () => ({
        url: "/settings/export",
        method: "GET",
      }),
    }),
    importSetting: builder.mutation({
      query: ({ body }) => ({
        url: "/settings/import",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Settings"],
    }),
    showPublicSetting: builder.query({
      query: () => ({
        url: "/settings/public",
        method: "GET",
      }),
    }),
    deleteSetting: builder.mutation({
      query: ({ id }) => ({
        url: `/settings/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Settings"],
    }),
  }),
});

export const {
  useGetSettingQuery,
  useCreateSettingMutation,
  useUpdateSettingMutation,
  useGetAllSettingGroupQuery,
  useGetSettingGroupQuery,
  useUpdateSettingBulkMutation,
  useExportSettingQuery,
  useImportSettingMutation,
  useShowPublicSettingQuery,
  useDeleteSettingMutation,
} = settingApi;
