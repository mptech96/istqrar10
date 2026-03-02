"use client";

import React, { forwardRef } from "react";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import DocumentTemplate from "@/components/common/document-template/document-template";

interface BranchReportsPrintProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

const BranchReportsPrint = forwardRef<
  HTMLDivElement,
  BranchReportsPrintProps
>(({ data }, ref) => {
  const t = useTranslations();
  const {
    branch_info,
    statistics,
    open_tickets,
    recent_visits,
  } = data || {};
  const reportDate = format(new Date(), "yyyy-MM-dd HH:mm");

  return (
    <div ref={ref} className="bg-white">
      <DocumentTemplate>
        <div className="flex flex-col gap-10 py-6">
          {/* Header Section */}
          <div className="flex justify-between items-end border-b-4 border-[#0F172A] pb-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-3xl font-extrabold text-[#0F172A]">
                {branch_info?.name ||
                  t("Branch Performance Report")}
              </h2>
              <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">
                {branch_info?.category ||
                  t("Branch Reports")}
              </p>
            </div>
            <div className="flex flex-col items-end text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                {t("Generated on")}
              </span>
              <span className="text-sm font-bold text-[#0F172A]">
                {reportDate}
              </span>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <section className="flex flex-col gap-4">
            <h3 className="text-xl font-bold text-[#1E293B] border-r-4 border-[#0F172A] pr-3 bg-slate-50 py-2">
              {t("Statistics")}
            </h3>
            <div className="grid grid-cols-4 gap-6">
              {[
                {
                  label: t("Total Visits"),
                  value: statistics?.total_visits || 0,
                },
                {
                  label: t("Overall Score"),
                  value: `${statistics?.avg_score || 0}%`,
                },
                {
                  label: t("Visits This Month"),
                  value: statistics?.visits_this_month || 0,
                },
                {
                  label: t("Compliance Score"),
                  value:
                    branch_info?.compliance_score || "0.00",
                },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="flex flex-col p-4 border border-slate-100 bg-slate-50/30 rounded-md"
                >
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">
                    {stat.label}
                  </span>
                  <span className="text-xl font-bold text-[#0F172A]">
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Recent Visits */}
          <section className="flex flex-col gap-4">
            <h3 className="text-xl font-bold text-[#1E293B] border-r-4 border-[#0F172A] pr-3 bg-slate-50 py-2">
              {t("Recent Visits")}
            </h3>
            <table className="w-full border-collapse border border-slate-200 text-xs text-right shadow-sm">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-200 p-3 font-bold text-[#334155]">
                    {t("Visit Date")}
                  </th>
                  <th className="border border-slate-200 p-3 font-bold text-[#334155]">
                    {t("Category")}
                  </th>
                  <th className="border border-slate-200 p-3 font-bold text-[#334155]">
                    {t("Auditor")}
                  </th>
                  <th className="border border-slate-200 p-3 font-bold text-[#334155]">
                    {t("Score")}
                  </th>
                  <th className="border border-slate-200 p-3 font-bold text-[#334155]">
                    {t("Status")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recent_visits &&
                recent_visits.length > 0 ? (
                  recent_visits.map(
                    (visit: any, index: number) => (
                      <tr
                        key={visit.id}
                        className={
                          index % 2 === 1
                            ? "bg-slate-50/30"
                            : "bg-white"
                        }
                      >
                        <td className="border border-slate-200 p-3 font-bold text-[#0F172A]">
                          {visit.visit_date}
                        </td>
                        <td className="border border-slate-200 p-3">
                          {visit.category_text ||
                            visit.category}
                        </td>
                        <td className="border border-slate-200 p-3">
                          {visit.auditor_name ||
                            visit.auditor?.name}
                        </td>
                        <td className="border border-slate-200 p-3 font-bold text-[#0F172A]">
                          {visit.score}%
                        </td>
                        <td className="border border-slate-200 p-3">
                          {visit.status_text ||
                            visit.status}
                        </td>
                      </tr>
                    ),
                  )
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="border border-slate-200 p-6 text-center text-slate-400 italic"
                    >
                      {t("No data available")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>

          {/* Section: Open Tickets */}
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
                    {t("Subject")}
                  </th>
                  <th className="border border-slate-200 p-3 font-bold text-[#334155]">
                    {t("Type")}
                  </th>
                  <th className="border border-slate-200 p-3 font-bold text-[#334155]">
                    {t("Priority")}
                  </th>
                  <th className="border border-slate-200 p-3 font-bold text-[#334155]">
                    {t("Status")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {open_tickets && open_tickets.length > 0 ? (
                  open_tickets.map(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (ticket: any, index: number) => (
                      <tr
                        key={ticket.id}
                        className={
                          index % 2 === 1
                            ? "bg-slate-50/30"
                            : "bg-white"
                        }
                      >
                        <td className="border border-slate-200 p-3 font-bold text-[#0F172A]">
                          {ticket.ticket_number}
                        </td>
                        <td className="border border-slate-200 p-3">
                          {ticket.subject}
                        </td>
                        <td className="border border-slate-200 p-3">
                          {ticket.ticket_type_text ||
                            ticket.ticket_type}
                        </td>
                        <td className="border border-slate-200 p-3 capitalize">
                          {t(ticket.priority)}
                        </td>
                        <td className="border border-slate-200 p-3">
                          {ticket.status_text ||
                            ticket.status}
                        </td>
                      </tr>
                    ),
                  )
                ) : (
                  <tr>
                    <td
                      colSpan={5}
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

BranchReportsPrint.displayName = "BranchReportsPrint";

export default BranchReportsPrint;
