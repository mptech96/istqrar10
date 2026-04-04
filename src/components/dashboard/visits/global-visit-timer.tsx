"use client";

import { useGetVisitsQuery } from "@/services/api/visits";
import { VisitTimer } from "./visit-timer";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

export function GlobalVisitTimer() {
  const user = useSelector((state: RootState) => state.auth.user);
  
  // Only search for active visits if the user is an auditor
  const isAuditor = user?.role === "auditor";
  
  // We fetch visits with in_progress status. 
  // Depending on API, we might need to filter manually or use a query.
  // Assuming the API supports a basic query for active visits.
  const { data, isFetching } = useGetVisitsQuery("status=in_progress&page_size=1", {
    skip: !isAuditor,
    pollingInterval: 30000, 
  });

  const activeVisit = data?.data?.[0];

  // Only show if:
  // 1. User is an auditor
  // 2. We're not currently busy fetching new data (avoid flicker)
  // 3. We have an active visit with in_progress status and a start time
  if (
    !isAuditor ||
    isFetching ||
    !activeVisit ||
    activeVisit.status !== "in_progress" ||
    !activeVisit.actual_start_time
  ) {
    return null;
  }

  return (
    <div className="hidden md:flex items-center px-4 py-1.5 bg-background border rounded-full shadow-sm">
      <div className="flex items-center gap-3">
        <div className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-muted-foreground leading-none font-medium uppercase tracking-wider">
            Active Visit
          </span>
          <VisitTimer 
            actualStartTime={activeVisit.actual_start_time} 
            estimatedDuration={activeVisit.estimated_duration || 60} 
            compact={true}
          />
        </div>
      </div>
    </div>
  );
}
