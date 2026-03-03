"use client";

import Header from "@/components/dashboard/header/header";
import BranchReportsPrint from "@/components/dashboard/reports/print-models/branch-reports-print";
import { Button } from "@/components/ui/button";
import { useLoader } from "@/hooks/use-loader";
import { useGetBranchReportsQuery } from "@/services/api/reports";
import { Printer } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";

import BranchReportsStats from "@/components/dashboard/reports/branch/branch-reports-stats";
import BranchTicketsTable from "@/components/dashboard/reports/branch/branch-tickets-table";
import FlexPieChart from "@/components/dashboard/reports/flex-pie-chart";

const BranchReportsPage = () => {
  const t = useTranslations();
  const printRef = useRef<HTMLDivElement>(null);
  const { start, stop } = useLoader();
  const { data: reportData, isLoading } =
    useGetBranchReportsQuery({});

  useEffect(() => {
    if (isLoading) {
      start();
    } else {
      stop();
    }
  }, [isLoading, start, stop]);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Branch-Report-${reportData?.branch_info?.name || "Export"}`,
  });

  const {
    branch_info,
    statistics,
    open_tickets,
    recent_visits,
  } = reportData || {};

  return (
    <div className="flex flex-col gap-6">
      <header className="flex justify-between items-center">
        <Header
          title="Branch Reports"
          description="View and print performance metrics for your branch"
        />
        <Button
          onClick={() => handlePrint()}
          className="gap-2"
        >
          <Printer className="h-4 w-4" />
          {isLoading ? t("Loading") : t("Print Report")}
        </Button>
      </header>

      {/* Stats Cards Component */}
      {reportData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BranchReportsStats
            statistics={statistics}
            branch_info={branch_info}
          />
          <FlexPieChart data={recent_visits || []} />
        </div>
      )}

      {/* Main Dashboard Layout */}
      <div>
        <BranchTicketsTable tickets={open_tickets || []} />
      </div>

      {/* Hidden Print Component */}
      <div className="absolute opacity-0 pointer-events-none -z-50 h-0 overflow-hidden">
        {reportData && (
          <BranchReportsPrint
            ref={printRef}
            data={reportData}
          />
        )}
      </div>
    </div>
  );
};

export default BranchReportsPage;
