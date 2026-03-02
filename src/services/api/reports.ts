
import api from "./index";

const reportsApi =api.injectEndpoints({
    endpoints:(builder)=>({
        getCompanyReports:builder.query({
            query:()=>"/reports/company-admin"
        }),
        getBranchReports:builder.query({
            query:()=>"/reports/branch-manager"
        }),
        getInspectorReports:builder.query({
            query:()=>"/reports/auditor"
        })
    })
})

export const {
    useGetCompanyReportsQuery,
    useGetBranchReportsQuery,
    useGetInspectorReportsQuery,
} = reportsApi;
