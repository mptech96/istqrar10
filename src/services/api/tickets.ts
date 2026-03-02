import  api  from "./index";

const ticketsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        createTicket: builder.mutation({
            query: (data) => ({
                url: "/tickets",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Tickets"],
        }),   
        getAllTickets: builder.query({
            query: (query?: string) => ({
                url: query ? `/tickets?${query}` : "/tickets",
                method: "GET",
            }),
            providesTags: ["Tickets"],
        }),
        getTicketById: builder.query({
            query: (id) => ({
                url: `/tickets/${id}`,
                method: "GET",
            }),
            providesTags: ["Tickets"],
        }),    updateTicket: builder.mutation({
            query: ({ id, data }) => ({
                url: `/tickets/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Tickets"],
        }),   
        deleteTicket: builder.mutation({
            query: (id) => ({
                url: `/tickets/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Tickets"],
        }),
        assignTicket: builder.mutation({
            query: ({ ticketId, data }) => ({
                url: `/tickets/${ticketId}/assign`,
                method: "Post",
                body: data,
            }),
            invalidatesTags: ["Tickets"],
        }),
        solveTicket: builder.mutation({
            query: ({ ticketId, data }) => ({
                url: `/tickets/${ticketId}/solve`,
                method: "Post",
                body: data,
            }),
            invalidatesTags: ["Tickets"],
        }),
        closeTicket: builder.mutation({
            query: ({ ticketId, data }) => ({
                url: `/tickets/${ticketId}/close`,
                method: "Post",
                body: data,
            }),
            invalidatesTags: ["Tickets"],
        }),
        getTicketsStats: builder.query({
            query: () => ({
                url: "/tickets/statistics/overview",
                method: "GET",
            }),
            providesTags: ["Tickets"],
        }),
    }),
});




export const {
  useCreateTicketMutation,
  useGetAllTicketsQuery,
  useGetTicketByIdQuery,
  useUpdateTicketMutation,
  useDeleteTicketMutation,
  useAssignTicketMutation,
  useSolveTicketMutation,
  useCloseTicketMutation,
  useGetTicketsStatsQuery,
} = ticketsApi;
