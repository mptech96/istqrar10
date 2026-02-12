import { logout, setCredentials } from '@/features/auth-slice';
import { RootState } from '@/lib/store';
import { User } from '@/types/user';
import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';

export const Base_URL = process.env.NEXT_PUBLIC_BASE_URL;
console.log(Base_URL);
// 1. Create a basic baseQuery that adds the token
const baseQuery = fetchBaseQuery({
  baseUrl: Base_URL,
  prepareHeaders: (headers, { getState }) => {
    // We assume the token is in the Redux store (hydrated from cookies)
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
      headers.set("Accept", "application/json");
      headers.set("Content-Type", "application/json");
    }
    return headers;
  },
});

// 2. Wrap it with a "Re-auth" wrapper to handle 401s
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Try to get a new token
    const refreshResult = await baseQuery('/auth/refresh', api, extraOptions);

    if (refreshResult.data) {
      // Store the new token
      api.dispatch(setCredentials({ ...refreshResult.data} as {user: User, token: string}));
      // Retry the original query
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Refresh failed - log the user out
      api.dispatch(logout());
    }
  }
  return result;
};








const api = createApi({
  reducerPath: "api",
  baseQuery:baseQueryWithReauth, 
  endpoints: () => ({}),
  tagTypes: ["Checklists", "Questions", "Conditions", "Criterias", "Answers",
              "Users", "Roles", "Permissions", "Settings", "Notifications",
              "Reports", "Dashboard","Visits"],
});

export default api;
