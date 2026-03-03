"use client";

import Header from "@/components/dashboard/header/header";
import React, { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useGetInspectorReportsQuery } from "@/services/api/reports";
import { useLoader } from "@/hooks/use-loader";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { useReactToPrint } from "react-to-print";

import AuditorStats from "@/components/dashboard/reports/auditor/auditor-stats";
import AuditorMonthlyChart from "@/components/dashboard/reports/auditor/auditor-monthly-chart";
import UpcomingVisitsTable from "@/components/dashboard/reports/auditor/upcoming-visits-table";
import AuditorReportsPrint from "@/components/dashboard/reports/print-models/auditor-reports-print";

const AuditorReports = () => {
  const t = useTranslations();
  const printRef = useRef<HTMLDivElement>(null);
  const { start, stop } = useLoader();
  const { data: reportData, isLoading } =
    useGetInspectorReportsQuery({});

  useEffect(() => {
    if (isLoading) {
      start();
    } else {
      stop();
    }
  }, [isLoading, start, stop]);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Auditor-Report-${reportData?.auditor_info?.name || "Export"}`,
  });

  const { statistics, visits_by_month, upcoming_visits } =
    reportData || {};

  return (
    <div className="flex flex-col gap-8">
      <header className="flex justify-between items-center">
        <Header
          title="Auditor Reports"
          description="View and print your performance metrics"
        />
        <Button
          onClick={() => handlePrint()}
          className="gap-2"
          disabled={isLoading || !reportData}
        >
          <Printer className="h-4 w-4" />
          {isLoading ? t("Loading") : t("Print Report")}
        </Button>
      </header>

      {reportData && (
        <>
          {/* Stats Cards */}
          <AuditorStats statistics={statistics} />

          <div className="grid grid-cols-1 gap-8">
            {/* Monthly Trend Chart */}
            <AuditorMonthlyChart
              data={visits_by_month || []}
            />

            {/* Upcoming Visits Table */}
            <UpcomingVisitsTable
              visits={upcoming_visits || []}
            />
          </div>
        </>
      )}

      {/* Hidden Print Component */}
      <div className="absolute opacity-0 pointer-events-none -z-50 h-0 overflow-hidden">
        {reportData && (
          <AuditorReportsPrint
            ref={printRef}
            data={reportData}
          />
        )}
      </div>
    </div>
  );
};

export default AuditorReports;
