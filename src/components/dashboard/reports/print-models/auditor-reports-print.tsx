"use client";

import React, { forwardRef } from "react";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import DocumentTemplate from "@/components/common/document-template/document-template";
import { AuditorReport } from "@/types/report";

interface AuditorReportsPrintProps {
  data: AuditorReport;
}

const AuditorReportsPrint = forwardRef<
  HTMLDivElement,
  AuditorReportsPrintProps
>(({ data }, ref) => {
  const t = useTranslations();
  const {
    auditor_info,
    statistics,
    visits_by_month,
    upcoming_visits,
    recent_verified_corrections,
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
                {auditor_info?.name ||
                  t("Auditor Performance Report")}
              </h2>
              <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">
                {auditor_info?.email ||
                  t("Auditor Reports")}
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
                  label: t("Completed Visits"),
                  value: statistics?.completed_visits || 0,
                },
                {
                  label: t("In Progress Visits"),
                  value:
                    statistics?.in_progress_visits || 0,
                },
                {
                  label: t("Average Score"),
                  value: `${statistics?.avg_score || 0}%`,
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

          {/* Section: Monthly visits trend table (since we can't print complex charts easily) */}
          <section className="flex flex-col gap-4">
            <h3 className="text-xl font-bold text-[#1E293B] border-r-4 border-[#0F172A] pr-3 bg-slate-50 py-2">
              {t("Monthly Visits Trend")}
            </h3>
            <table className="w-full border-collapse border border-slate-200 text-xs text-right shadow-sm">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-200 p-3 font-bold text-[#334155]">
                    {t("Month")}
                  </th>
                  <th className="border border-slate-200 p-3 font-bold text-[#334155]">
                    {t("Visits Count")}
                  </th>
                  <th className="border border-slate-200 p-3 font-bold text-[#334155]">
                    {t("Average Score")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visits_by_month &&
                visits_by_month.length > 0 ? (
                  visits_by_month.map((item, index) => (
                    <tr
                      key={index}
                      className={
                        index % 2 === 1
                          ? "bg-slate-50/30"
                          : "bg-white"
                      }
                    >
                      <td className="border border-slate-200 p-3 font-bold text-[#0F172A]">
                        {item.month}
                      </td>
                      <td className="border border-slate-200 p-3">
                        {item.count}
                      </td>
                      <td className="border border-slate-200 p-3 font-bold text-[#0F172A]">
                        {parseFloat(
                          item.avg_percentage,
                        ).toFixed(2)}
                        %
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      className="border border-slate-200 p-6 text-center text-slate-400 italic"
                    >
                      {t("No data available")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>

          {/* Section: Upcoming Visits */}
          <section className="flex flex-col gap-4">
            <h3 className="text-xl font-bold text-[#1E293B] border-r-4 border-[#0F172A] pr-3 bg-slate-50 py-2">
              {t("Upcoming Visits")}
            </h3>
            <table className="w-full border-collapse border border-slate-200 text-xs text-right shadow-sm">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-200 p-3 font-bold text-[#334155]">
                    {t("Branch")}
                  </th>
                  <th className="border border-slate-200 p-3 font-bold text-[#334155]">
                    {t("Scheduled Date")}
                  </th>
                  <th className="border border-slate-200 p-3 font-bold text-[#334155]">
                    {t("Scheduled Time")}
                  </th>
                  <th className="border border-slate-200 p-3 font-bold text-[#334155]">
                    {t("Checklist")}
                  </th>
                  <th className="border border-slate-200 p-3 font-bold text-[#334155]">
                    {t("Status")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {upcoming_visits &&
                upcoming_visits.length > 0 ? (
                  upcoming_visits.map((visit, index) => (
                    <tr
                      key={visit.id}
                      className={
                        index % 2 === 1
                          ? "bg-slate-50/30"
                          : "bg-white"
                      }
                    >
                      <td className="border border-slate-200 p-3 font-bold text-[#0F172A]">
                        {visit.branch?.name || t("Unknown")}
                      </td>
                      <td className="border border-slate-200 p-3">
                        {visit.scheduled_date}
                      </td>
                      <td className="border border-slate-200 p-3">
                        {visit.scheduled_time}
                      </td>
                      <td className="border border-slate-200 p-3">
                        {visit.checklist?.name ||
                          t("Unknown")}
                      </td>
                      <td className="border border-slate-200 p-3">
                        {visit.status_text || visit.status}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="border border-slate-200 p-6 text-center text-slate-400 italic"
                    >
                      {t("No upcoming visits")}
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

AuditorReportsPrint.displayName = "AuditorReportsPrint";

export default AuditorReportsPrint;
