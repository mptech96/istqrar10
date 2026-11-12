"use client";

import CompaniesDataTable from "@/components/dashboard/companies/companies-data-table";
import Header from "@/components/dashboard/header/header";
import OverViewStats from "@/components/dashboard/over-view/stats";
import VisitTicketsSection from "@/components/dashboard/reports/visit-tickets-section";
import TicketsDataTable from "@/components/dashboard/tickets/tickets-data-table";
import VisitsDataTable from "@/components/dashboard/visits/visits-data-table";
import AdminReports from "@/components/dashboard/reports/print-models/admin-reports";
import { Button } from "@/components/ui/button";
import { FileUp, Printer } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useGetSuperAdminStatsQuery } from "@/services/api/stats";
import { useGetChecklistsQuery } from "@/services/api/checklists";
import { useReactToPrint } from "react-to-print";
import { useLoader } from "@/hooks/use-loader";
import { useGetCompaniesQuery } from "@/services/api/companies";
import { useGetBranchesQuery } from "@/services/api/branches";
import { useGetInspectorsQuery } from "@/services/api/inspectors";
import { useGetCriteriaQuery } from "@/services/api/criteria";
import { useAppSelector } from "@/lib/store";
import {
  useGetCompanyReportsQuery,
  useGetBranchReportsQuery,
  useGetInspectorReportsQuery,
} from "@/services/api/reports";
import CompanyReportsPrint from "@/components/dashboard/reports/print-models/company-reports-print";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Building2,
  ClipboardCheck,
  TrendingUp,
  Users as UsersIcon,
} from "lucide-react";

const Reports = () => {
  const t = useTranslations();
  const user = useAppSelector((state) => state.auth.user);
  const role = user?.role;

  const printRef = useRef<HTMLDivElement>(null);
  const { start, stop } = useLoader();

  // Admin Data
  const { data: adminStats, isLoading: adminLoading } =
    useGetSuperAdminStatsQuery(
      {},
      { skip: role !== "super_admin" && role !== "admin" },
    );
  const { data: companiesResponse } = useGetCompaniesQuery("", {
    skip: role !== "super_admin" && role !== "admin",
  });
  const { data: branchesResponse } = useGetBranchesQuery("", {
    skip: role !== "super_admin" && role !== "admin",
  });
  const { data: inspectorsResponse } = useGetInspectorsQuery("", {
    skip: role !== "super_admin" && role !== "admin",
  });
  const { data: categoriesResponse } = useGetCriteriaQuery("", {
    skip: role !== "super_admin" && role !== "admin",
  });
  const { data: checklistsResponse } = useGetChecklistsQuery("page_size=1", {
    skip: role !== "super_admin" && role !== "admin",
  });

  // Company Data
  const { data: companyReportData, isLoading: companyLoading } =
    useGetCompanyReportsQuery({}, { skip: role !== "company_admin" });

  // Branch Data
  const { data: branchReportData, isLoading: branchLoading } =
    useGetBranchReportsQuery({}, { skip: role !== "branch_manager" });

  // Inspector Data
  const { data: inspectorReportData, isLoading: inspectorLoading } =
    useGetInspectorReportsQuery({}, { skip: role !== "auditor" });

  const isLoading =
    adminLoading || companyLoading || branchLoading || inspectorLoading;

  useEffect(() => {
    if (isLoading) {
      start();
    } else {
      stop();
    }
  }, [isLoading, start, stop]);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Report-${role}-${new Date().toLocaleDateString()}`,
  });
  // Consolidate data for all views
  const overallStats = {
    total_companies: companiesResponse?.length || 0,
    total_branches: branchesResponse?.length || 0,
    total_users: inspectorsResponse?.length || 0,
    total_auditors: inspectorsResponse?.length || 0,
    total_visits: adminStats?.overall_statistics?.total_visits || 0,
    // extra fields for internal use
    total_categories: categoriesResponse?.length || 0,
    total_checklists: checklistsResponse?.length || 0,
  };
  const ticketsSummary = adminStats?.tickets_summary;
  const categoryCount = adminStats?.visits_by_category
    ? Object.keys(adminStats.visits_by_category).length
    : 0;
  const totalChecklistsCount = checklistsResponse?.meta?.total || 0;

  const topCompanies = adminStats?.top_companies;
  const latestVisits = adminStats?.latest_visits;
  const latestTickets = adminStats?.latest_tickets;

  if (role === "company_admin") {
    const { statistics, company_info, branches_performance } =
      companyReportData || {};
    return (
      <section className="flex flex-col gap-6">
        <header className="flex justify-between items-center">
          <Header
            title={t("Company Reports")}
            description={t(
              "View and print performance metrics for your company",
            )}
          />
          <Button onClick={() => handlePrint()} className="gap-2">
            <Printer className="h-4 w-4" />
            {t("Print Report")}
          </Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-medium text-slate-500 uppercase">
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
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-medium text-slate-500 uppercase">
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
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-medium text-slate-500 uppercase">
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
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-medium text-slate-500 uppercase">
                {t("Auditors")}
              </CardTitle>
              <UsersIcon className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statistics?.auditors_count || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold">
              {t("Branches Performance")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-right border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b">
                    <th className="p-3 font-semibold">{t("Branch Name")}</th>
                    <th className="p-3 font-semibold">{t("Category")}</th>
                    <th className="p-3 font-semibold">{t("Total Visits")}</th>
                    <th className="p-3 font-semibold">{t("Avg Score")}</th>
                    <th className="p-3 font-semibold">{t("Last Visit")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {branches_performance?.map(
                    (branch: {
                      id: number;
                      name: string;
                      category: string;
                      total_visits: number;
                      avg_score: number;
                      last_visit_percentage: number | null;
                    }) => (
                      <tr key={branch.id} className="hover:bg-slate-50/50">
                        <td className="p-3 font-medium">{branch.name}</td>
                        <td className="p-3 text-slate-500">
                          {branch.category}
                        </td>
                        <td className="p-3">{branch.total_visits}</td>
                        <td className="p-3 font-bold text-blue-600">
                          {branch.avg_score}%
                        </td>
                        <td className="p-3">
                          {branch.last_visit_percentage !== null
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

        <div className="hidden">
          {companyReportData && (
            <CompanyReportsPrint ref={printRef} data={companyReportData} />
          )}
        </div>
      </section>
    );
  }

  // Branch Manager View
  if (role === "branch_manager") {
    return (
      <section className="flex flex-col gap-6">
        <header className="flex justify-between items-center">
          <Header
            title={t("Branch Reports")}
            description={t("View performance metrics for your branch")}
          />
          <Button onClick={() => handlePrint()} className="gap-2">
            <Printer className="h-4 w-4" />
            {t("Print Report")}
          </Button>
        </header>
        <Card className="p-12 text-center text-slate-500 italic flex flex-col items-center gap-4">
          <Building2 className="h-12 w-12 text-slate-300" />
          <p>
            {t(
              "Branch report dashboard is active. Use the print button for detailed analysis.",
            )}
          </p>
          {branchReportData && (
            <p className="text-xs">
              Data synced: {new Date().toLocaleTimeString()}
            </p>
          )}
        </Card>
      </section>
    );
  }

  // Auditor/Inspector View
  if (role === "auditor") {
    return (
      <section className="flex flex-col gap-6">
        <header className="flex justify-between items-center">
          <Header
            title={t("Inspector Reports")}
            description={t("View your audit performance metrics")}
          />
          <Button onClick={() => handlePrint()} className="gap-2">
            <Printer className="h-4 w-4" />
            {t("Print Report")}
          </Button>
        </header>
        <Card className="p-12 text-center text-slate-500 italic flex flex-col items-center gap-4">
          <ClipboardCheck className="h-12 w-12 text-slate-300" />
          <p>
            {t(
              "Inspector report dashboard is active. Detailed reports available via Print.",
            )}
          </p>
          {inspectorReportData && (
            <p className="text-xs">
              Data synced: {new Date().toLocaleTimeString()}
            </p>
          )}
        </Card>
      </section>
    );
  }

  // Admin View (Default)
  return (
    <section className="flex flex-col gap-6">
      <header className="flex justify-between items-center">
        <Header title={"Reports"} description={"Manage reports"} />
        <div className="flex gap-2">
          <Button variant="default">
            <FileUp />
            <p>{t("Export")}</p>
          </Button>
          <Button variant="default" onClick={() => handlePrint()}>
            <Printer />
            <p>{t("Print")}</p>
          </Button>
        </div>
      </header>
      <div className="flex flex-col gap-4">
        <OverViewStats />
        <VisitTicketsSection />
        <CompaniesDataTable />
        <VisitsDataTable />
        <TicketsDataTable />
      </div>

      <div className="hidden">
        <AdminReports
          ref={printRef}
          stats={overallStats}
          tickets={ticketsSummary}
          topCompanies={topCompanies}
          latestVisits={latestVisits}
          latestTickets={latestTickets}
          allCompanies={companiesResponse?.data || companiesResponse || []}
          allBranches={branchesResponse?.data || branchesResponse || []}
          allAuditors={inspectorsResponse?.data || inspectorsResponse || []}
          allUsers={inspectorsResponse?.data || inspectorsResponse || []}
          systemInfo={{
            total_questions: 0,
            total_checklists: totalChecklistsCount,
            total_categories: categoriesResponse?.meta?.total || categoryCount,
          }}
        />
      </div>
    </section>
  );
};

export default Reports;
