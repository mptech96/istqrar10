import  api  from "./index";
const statsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getSuperAdminStats: builder.query({
            query: () =>({
                url: "/dashboard/super-admin",
                method: "GET",
            }),
            providesTags: ["Dashboard"],
        }),
        getCompanyDashboard: builder.query({
            query: () =>({
                url: "/dashboard/company-admin",
                method: "GET",
            }),
            providesTags: ["Dashboard"],
        }),
    }),
});



export const { useGetSuperAdminStatsQuery, useGetCompanyDashboardQuery } = statsApi;
