
import { createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

export const Base_URL = process.env.NEXT_PUBLIC_BASE_URL;
console.log(Base_URL);
// 1. Create a basic baseQuery that adds the token
const baseQuery = fetchBaseQuery({
  baseUrl: Base_URL,
  credentials: "include",
  prepareHeaders: (headers) => {
      headers.set("Accept", "application/json");
      headers.set("Content-Type", "application/json");
    return headers;
  },
});



const api = createApi({
  reducerPath: "api",
  baseQuery:baseQuery, 
  endpoints: () => ({}),
  tagTypes: ["Checklists", "Questions", "Conditions", "Criterias", "Answers",
              "Users", "Roles", "Permissions", "Settings", "Notifications",
              "Reports", "Dashboard","Visits" ,"branchStats" ,"Branches", "Companies","Criterias","Tickets","BranchVisits"],
});

export default api;
