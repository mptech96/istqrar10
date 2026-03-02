"use client";

import DocumentTemplate from "@/components/common/document-template/document-template";
import { useTranslations } from "next-intl";
import React, { forwardRef } from "react";

interface CompanyReportsPrintProps {
  data: {
    company_info: {
      id: number;
      name: string;
      overall_score: string | number;
    };
    statistics: {
      branches_count: number;
      auditors_count: number;
      branch_managers_count: number;
      total_visits: number;
      completed_visits: number;
      avg_company_score: number;
    };
    branches_performance: {
      id: number;
      name: string;
      last_visit_percentage: number | null;
      category: string;
      total_visits: number;
      avg_score: number;
    }[];
    pending_corrections: {
      id: number;
      description: string;
      status: string;
    }[];
    open_tickets: {
      id: number;
      ticket_number: string;
      creator: { name: string } | null;
      branch: { name: string } | null;
      subject: string;
      priority: string;
      status_text: string;
      created_at: string;
    }[];
  };
}

const CompanyReportsPrint = forwardRef<
  HTMLDivElement,
  CompanyReportsPrintProps
>(({ data }, ref) => {
  const t = useTranslations();
  const {
    company_info,
    statistics,
    branches_performance,
    open_tickets,
  } = data;

  return (
    <div ref={ref} className="bg-white">
      <DocumentTemplate>
        <div className="flex flex-col gap-10 py-6">
          {/* Header Section */}
          <div className="flex justify-between items-end border-b-4 border-[#0F172A] pb-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-3xl font-extrabold text-[#0F172A]">
                {company_info.name}
              </h2>
              <p className="text-slate-500 text-sm font-medium">
                {t("Company Reports")}
              </p>
            </div>
            <div className="flex flex-col items-center bg-slate-50 px-6 py-3 rounded-lg border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                {t("Company Overall Score")}
              </span>
              <span className="text-3xl font-black text-[#0F172A]">
                {company_info.overall_score}%
              </span>
            </div>
          </div>

          {/* Section 1: Statistics Grid */}
          <section className="flex flex-col gap-4">
            <h3 className="text-xl font-bold text-[#1E293B] border-r-4 border-[#0F172A] pr-3 bg-slate-50 py-2">
              {t("Statistics")}
            </h3>
            <div className="grid grid-cols-3 gap-6">
              {[
                {
                  label: t("Total Branches"),
                  value: statistics.branches_count,
                },
                {
                  label: t("Auditors Count"),
                  value: statistics.auditors_count,
                },
                {
                  label: t("Managers Count"),
                  value: statistics.branch_managers_count,
                },
                {
                  label: t("Total Visits"),
                  value: statistics.total_visits,
                },
                {
                  label: t("Completed Visits"),
                  value: statistics.completed_visits,
                },
                {
                  label: t("Average Company Score"),
                  value: `${statistics.avg_company_score}%`,
                },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="flex flex-col p-4 border border-slate-100 bg-slate-50/30 rounded-md"
                >
                  <span className="text-[10px] text-slate-500 font-bold uppercase">
                    {stat.label}
                  </span>
                  <span className="text-xl font-bold text-[#0F172A]">
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Section 2: Branches Performance */}
          <section className="flex flex-col gap-4">
            <h3 className="text-xl font-bold text-[#1E293B] border-r-4 border-[#0F172A] pr-3 bg-slate-50 py-2">
              {t("Branches Performance")}
            </h3>
            <table className="w-full border-collapse border border-slate-200 text-xs text-right shadow-sm">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-200 p-3 font-bold text-[#334155]">
                    {t("Branch Name")}
                  </th>
                  <th className="border border-slate-200 p-3 font-bold text-[#334155]">
                    {t("Category")}
                  </th>
                  <th className="border border-slate-200 p-3 font-bold text-[#334155]">
                    {t("Total Visits")}
                  </th>
                  <th className="border border-slate-200 p-3 font-bold text-[#334155]">
                    {t("Avg Score")}
                  </th>
                  <th className="border border-slate-200 p-3 font-bold text-[#334155]">
                    {t("Last Visit Percentage")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {branches_performance.map(
                  (branch, index) => (
                    <tr
                      key={branch.id}
                      className={
                        index % 2 === 1
                          ? "bg-slate-50/30"
                          : ""
                      }
                    >
                      <td className="border border-slate-200 p-3 font-semibold">
                        {branch.name}
                      </td>
                      <td className="border border-slate-200 p-3">
                        {branch.category}
                      </td>
                      <td className="border border-slate-200 p-3">
                        {branch.total_visits}
                      </td>
                      <td className="border border-slate-200 p-3 font-bold text-[#0F172A]">
                        {branch.avg_score}%
                      </td>
                      <td className="border border-slate-200 p-3">
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
          </section>

          {/* Section 3: Open Tickets */}
          <section className="flex flex-col gap-4">
            <h3 className="text-xl font-bold text-[#1E293B] border-r-4 border-[#0F172A] pr-3 bg-slate-50 py-2">
              {t("Open Tickets")}
            </h3>
            <table className="w-full border-collapse border border-slate-200 text-xs text-right shadow-sm">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-200 p-3 font-bold text-[#334155]">
                    {t("Ticket Number")}
                  </th>
                  <th className="border border-slate-200 p-3 font-bold text-[#334155]">
                    {t("Creator")}
                  </th>
                  <th className="border border-slate-200 p-3 font-bold text-[#334155]">
                    {t("Branch")}
                  </th>
                  <th className="border border-slate-200 p-3 font-bold text-[#334155]">
                    {t("Subject")}
                  </th>
                  <th className="border border-slate-200 p-3 font-bold text-[#334155]">
                    {t("Priority")}
                  </th>
                  <th className="border border-slate-200 p-3 font-bold text-[#334155]">
                    {t("Status")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {open_tickets.map((ticket, index) => (
                  <tr
                    key={ticket.id}
                    className={
                      index % 2 === 1
                        ? "bg-slate-50/30"
                        : ""
                    }
                  >
                    <td className="border border-slate-200 p-3 font-bold text-[#0F172A]">
                      {ticket.ticket_number}
                    </td>
                    <td className="border border-slate-200 p-3">
                      {ticket.creator?.name || "-"}
                    </td>
                    <td className="border border-slate-200 p-3">
                      {ticket.branch?.name || "-"}
                    </td>
                    <td className="border border-slate-200 p-3">
                      {ticket.subject}
                    </td>
                    <td className="border border-slate-200 p-3 capitalize font-medium">
                      {t(ticket.priority)}
                    </td>
                    <td className="border border-slate-200 p-3">
                      {ticket.status_text}
                    </td>
                  </tr>
                ))}
                {open_tickets.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="border border-slate-200 p-6 text-center text-slate-400 italic"
                    >
                      {t("No open tickets")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>
        </div>
      </DocumentTemplate>
    </div>
  );
});

CompanyReportsPrint.displayName = "CompanyReportsPrint";

export default CompanyReportsPrint;
