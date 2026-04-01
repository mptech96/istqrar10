import { PaginatedResponse } from "@/types/paginated-response";
import { Notification } from "@/types/notification";
import api  from "./index";



const notificationsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getNotifications: builder.query<PaginatedResponse<Notification>, string>({
            query: (query:string) => (
                {
                    url:`/notifications?${query}`,
                    method:"GET",
                    
                }
            ),
            providesTags: ['Notifications'],
        }),
        getNotificationById: builder.query<Notification, string>({
            query: (id:string) => (
                {
                    url:`/notifications/${id}`,
                    method:"GET",
                    
                }
            ),
            providesTags: ['Notifications'],
        }),
        readNotification: builder.mutation<void, string | number>({
            query: (id) => (
                {
                    url:`/notifications/${id}/read`,
                    method:"PATCH",
                    
                }
            ),
            invalidatesTags: ['Notifications'],
        }),
        readAllNotifications: builder.mutation<void, void>({
            query: () => (
                {
                    url:`/notifications/mark-all-read`,
                    method:"POST",
                    
                }
            ),
            invalidatesTags: ['Notifications'],
        }),
        deleteNotification: builder.mutation<void, string | number>({
            query: (id) => (
                {
                    url:`/notifications/${id}`,
                    method:"DELETE",
                    
                }
            ),
            invalidatesTags: ['Notifications'],
        }),
    }),
});

export const { 
    useGetNotificationsQuery, 
    useGetNotificationByIdQuery, 
    useReadNotificationMutation, 
    useReadAllNotificationsMutation, 
    useDeleteNotificationMutation 
} = notificationsApi;