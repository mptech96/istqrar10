"use client";

import Header from "@/components/dashboard/header/header";
import CompanyReportsPrint from "@/components/dashboard/reports/print-models/company-reports-print";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLoader } from "@/hooks/use-loader";
import { useGetCompanyReportsQuery } from "@/services/api/reports";
import {
  Printer,
  TrendingUp,
  Users,
  Building2,
  ClipboardCheck,
} from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";

const CompanyReportsPage = () => {
  const t = useTranslations();
  const printRef = useRef<HTMLDivElement>(null);
  const { start, stop } = useLoader();
  const { data: reportData, isLoading } =
    useGetCompanyReportsQuery({});

  useEffect(() => {
    if (isLoading) {
      start();
    } else {
      stop();
    }
  }, [isLoading, start, stop]);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Company-Report-${reportData?.company_info?.name || "Export"}`,
  });

  if (!reportData && !isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-slate-500 italic">
        {t("No data available")}
      </div>
    );
  }

  const { statistics, company_info, branches_performance } =
    reportData || {};

  return (
    <div className="flex flex-col gap-6">
      <header className="flex justify-between items-center">
        <Header
          title={"Company Reports"}
          description={
            "View and print performance metrics for your company"
          }
        />
        <Button
          onClick={() => handlePrint()}
          className="gap-2"
        >
          <Printer className="h-4 w-4" />
          {t("Print Report")}
        </Button>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">
              {t("Total Branches")}
            </CardTitle>
            <Building2 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statistics?.branches_count || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">
              {t("Total Visits")}
            </CardTitle>
            <ClipboardCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statistics?.total_visits || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">
              {t("Overall Score")}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {company_info?.overall_score || "0"}%
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">
              {t("Auditors")}
            </CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statistics?.auditors_count || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Layout */}
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-800">
              {t("Branches Performance")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left rtl:text-right border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="p-4 font-semibold text-slate-600">
                      {t("Branch Name")}
                    </th>
                    <th className="p-4 font-semibold text-slate-600">
                      {t("Category")}
                    </th>
                    <th className="p-4 font-semibold text-slate-600">
                      {t("Total Visits")}
                    </th>
                    <th className="p-4 font-semibold text-slate-600">
                      {t("Avg Score")}
                    </th>
                    <th className="p-4 font-semibold text-slate-600">
                      {t("Last Visit")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {branches_performance?.map(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (branch: any) => (
                      <tr
                        key={branch.id}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="p-4 font-medium">
                          {branch.name}
                        </td>
                        <td className="p-4 text-slate-500">
                          {branch.category}
                        </td>
                        <td className="p-4">
                          {branch.total_visits}
                        </td>
                        <td className="p-4">
                          <span
                            className={`font-bold ${branch.avg_score >= 80 ? "text-green-600" : branch.avg_score >= 50 ? "text-orange-500" : "text-red-500"}`}
                          >
                            {branch.avg_score}%
                          </span>
                        </td>
                        <td className="p-4 font-medium text-slate-700">
                          {branch.last_visit_percentage !==
                          null
                            ? `${branch.last_visit_percentage}%`
                            : "-"}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hidden Print Component */}
      <div className="hidden">
        {reportData && (
          <CompanyReportsPrint
            ref={printRef}
            data={reportData}
          />
        )}
      </div>
    </div>
  );
};

export default CompanyReportsPage;
