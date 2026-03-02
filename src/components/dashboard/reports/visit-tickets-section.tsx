"use client";
import React from "react";
import TicketsStats from "./tickets-stats";
import VisitCategoryPieChart from "./visit-category-pie";
import { useGetVisitsQuery } from "@/services/api/visits";

const VisitTicketsSection = () => {
  const { data: visitsResponse } = useGetVisitsQuery(
    "page_size=1000",
  );
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <TicketsStats />
      <VisitCategoryPieChart
        data={visitsResponse?.data || []}
      />
    </section>
  );
};

export default VisitTicketsSection;
