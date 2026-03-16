
import api  from "./index";

const plans = api.injectEndpoints({
    endpoints: (builder) => ({
        getServiceRequests: builder.query({
            query: (query?: string) => ({
                url: `/service-requests${query ? `?${query}` : ""}`,
                method: "GET",
            }),
        }),
        createServiceRequest: builder.mutation({
            query: (data) => ({
                url: "/service-requests",
                method: "POST",
                body: data,
            }),
        }),
    }),
});


export const { useGetServiceRequestsQuery, useCreateServiceRequestMutation } = plans;