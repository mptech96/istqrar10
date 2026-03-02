import React, { forwardRef } from "react";
import DocumentTemplate from "@/components/common/document-template/document-template";
import { useTranslations } from "next-intl";

interface AdminReportsProps {
  stats?: {
    total_companies: number;
    total_branches: number;
    total_users: number;
    total_auditors: number;
    total_visits: number;
  };
  tickets?: {
    total: number;
    open: number;
    overdue: number;
  };
  systemInfo?: {
    total_questions: number;
    total_checklists: number;
    total_categories: number;
  };
  topCompanies?: {
    id: number;
    name: string;
    total_branches: number;
    avg_percentage: string | number;
    category: string;
  }[];
  latestVisits?: {
    id: number;
    branch?: { name: string };
    auditor?: { name: string };
    scheduled_date: string;
    status_text: string;
  }[];
  latestTickets?: {
    id: number;
    ticket_number: string;
    creator?: { name: string };
    subject: string;
    priority: string;
    status: string;
  }[];
  allCompanies?: {
    id: number;
    name: string;
    email: string;
    phone: string;
    city: string;
    status: string;
  }[];
  allBranches?: {
    id: number;
    name: string;
    company?: { name: string };
    phone: string;
    compliance_score: number;
  }[];
  allAuditors?: {
    id: number;
    name: string;
    email: string;
  }[];
  allUsers?: {
    id: number;
    name: string;
    role?: string[];
  }[];
}

const AdminReports = forwardRef<
  HTMLDivElement,
  AdminReportsProps
>(
  (
    {
      stats,
      tickets,
      systemInfo,
      // topCompanies, // Not used in currently rendered layout
      latestVisits,
      latestTickets,
      allCompanies,
      allBranches,
      allAuditors,
      allUsers,
    },
    ref,
  ) => {
    const t = useTranslations();

    return (
      <div ref={ref} className="bg-white">
        <DocumentTemplate>
          <div className="flex flex-col gap-10 py-6">
            <h2 className="text-3xl font-extrabold border-b-4 border-[#0F172A] pb-4 text-[#0F172A]">
              {t("Reports")}
            </h2>

            {/* Section 1: Summaries */}
            <div className="grid grid-cols-2 gap-10">
              <section className="flex flex-col gap-4">
                <h3 className="text-xl font-bold text-[#1E293B] border-r-4 border-[#0F172A] pr-3 bg-slate-50 py-2">
                  {t("Overall Statistics")}
                </h3>
                <table className="w-full border-collapse border border-slate-200 text-xs shadow-sm">
                  <thead>
                    <tr className="bg-slate-100 text-right">
                      <th className="border border-slate-200 p-3 font-bold text-[#334155]">
                        {t("Item")}
                      </th>
                      <th className="border border-slate-200 p-3 font-bold text-[#334155]">
                        {t("Count")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-slate-200 p-3">
                        {t("Total Companies")}
                      </td>
                      <td className="border border-slate-200 p-3 font-semibold text-[#0F172A]">
                        {stats?.total_companies ?? 0}
                      </td>
                    </tr>
                    <tr className="bg-slate-50/50">
                      <td className="border border-slate-200 p-3">
                        {t("Total Branches")}
                      </td>
                      <td className="border border-slate-200 p-3 font-semibold text-[#0F172A]">
                        {stats?.total_branches ?? 0}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-slate-200 p-3">
                        {t("Total Users")}
                      </td>
                      <td className="border border-slate-200 p-3 font-semibold text-[#0F172A]">
                        {stats?.total_users ?? 0}
                      </td>
                    </tr>
                    <tr className="bg-slate-50/50">
                      <td className="border border-slate-200 p-3">
                        {t("Total Auditors")}
                      </td>
                      <td className="border border-slate-200 p-3 font-semibold text-[#0F172A]">
                        {stats?.total_auditors ?? 0}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-slate-200 p-3">
                        {t("Total Visits")}
                      </td>
                      <td className="border border-slate-200 p-3 font-semibold text-[#0F172A]">
                        {stats?.total_visits ?? 0}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </section>

              <div className="flex flex-col gap-10">
                <section className="flex flex-col gap-4">
                  <h3 className="text-xl font-bold text-[#1E293B] border-r-4 border-[#0F172A] pr-3 bg-slate-50 py-2">
                    {t("Support Tickets Summary")}
                  </h3>
                  <table className="w-full border-collapse border border-slate-200 text-xs shadow-sm">
                    <thead>
                      <tr className="bg-slate-100 text-right">
                        <th className="border border-slate-200 p-3 font-bold text-[#334155]">
                          {t("Category")}
                        </th>
                        <th className="border border-slate-200 p-3 font-bold text-[#334155]">
                          {t("Count")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-slate-200 p-3">
                          {t("Total Tickets")}
                        </td>
                        <td className="border border-slate-200 p-3 font-semibold text-[#0F172A]">
                          {tickets?.total ?? 0}
                        </td>
                      </tr>
                      <tr className="bg-slate-50/50">
                        <td className="border border-slate-200 p-3">
                          {t("Open Tickets")}
                        </td>
                        <td className="border border-slate-200 p-3 font-semibold text-blue-700">
                          {tickets?.open ?? 0}
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-slate-200 p-3">
                          {t("Total Overdue")}
                        </td>
                        <td className="border border-slate-200 p-3 font-semibold text-red-700">
                          {tickets?.overdue ?? 0}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </section>

                <section className="flex flex-col gap-4">
                  <h3 className="text-xl font-bold text-[#1E293B] border-r-4 border-[#0F172A] pr-3 bg-slate-50 py-2">
                    {t("System Overview")}
                  </h3>
                  <table className="w-full border-collapse border border-slate-200 text-xs shadow-sm">
                    <thead>
                      <tr className="bg-slate-100 text-right">
                        <th className="border border-slate-200 p-3 font-bold text-[#334155]">
                          {t("Item")}
                        </th>
                        <th className="border border-slate-200 p-3 font-bold text-[#334155]">
                          {t("Count")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-slate-200 p-3">
                          {t("Total Questions")}
                        </td>
                        <td className="border border-slate-200 p-3 font-semibold text-[#0F172A]">
                          {systemInfo?.total_questions ?? 0}
                        </td>
                      </tr>
                      <tr className="bg-slate-50/50">
                        <td className="border border-slate-200 p-3">
                          {t("Total Checklists")}
                        </td>
                        <td className="border border-slate-200 p-3 font-semibold text-[#0F172A]">
                          {systemInfo?.total_checklists ??
                            0}
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-slate-200 p-3">
                          {t("Total Categories")}
                        </td>
                        <td className="border border-slate-200 p-3 font-semibold text-[#0F172A]">
                          {systemInfo?.total_categories ??
                            0}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </section>
              </div>
            </div>

            {/* Table 4: Top Companies */}
            {/* This section is replaced by the new "Section 2: Full Entity Lists" below */}

            {/* Section 2: Full Entity Lists */}
            <div className="flex flex-col gap-12 pt-4">
              {/* All Companies */}
              <section className="flex flex-col gap-4">
                <h3 className="text-xl font-bold text-[#1E293B] border-b-2 border-slate-200 pb-2">
                  {t("All Companies")}
                </h3>
                <table className="w-full border-collapse border border-slate-200 text-xs text-right shadow-sm">
                  <thead>
                    <tr className="bg-slate-50 text-right">
                      <th className="border border-slate-200 p-3 font-bold text-[#475569]">
                        {t("Company Name")}
                      </th>
                      <th className="border border-slate-200 p-3 font-bold text-[#475569]">
                        {t("Email")}
                      </th>
                      <th className="border border-slate-200 p-3 font-bold text-[#475569]">
                        {t("Phone")}
                      </th>
                      <th className="border border-slate-200 p-3 font-bold text-[#475569]">
                        {t("City")}
                      </th>
                      <th className="border border-slate-200 p-3 font-bold text-[#475569]">
                        {t("Status")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {allCompanies?.map((company, index) => (
                      <tr
                        key={company.id}
                        className={
                          index % 2 === 1
                            ? "bg-slate-50/30"
                            : ""
                        }
                      >
                        <td className="border border-slate-200 p-3 font-medium">
                          {company.name}
                        </td>
                        <td className="border border-slate-200 p-3">
                          {company.email}
                        </td>
                        <td className="border border-slate-200 p-3">
                          {company.phone}
                        </td>
                        <td className="border border-slate-200 p-3 font-semibold">
                          {company.city}
                        </td>
                        <td className="border border-slate-200 p-3 capitalize">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] ${company.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                          >
                            {t(`${company.status}`)}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {(!allCompanies ||
                      allCompanies.length === 0) && (
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

              {/* All Branches */}
              <section className="flex flex-col gap-4">
                <h3 className="text-xl font-bold text-[#1E293B] border-b-2 border-slate-200 pb-2">
                  {t("All Branches")}
                </h3>
                <table className="w-full border-collapse border border-slate-200 text-xs text-right shadow-sm">
                  <thead>
                    <tr className="bg-slate-50 text-right">
                      <th className="border border-slate-200 p-3 font-bold text-[#475569]">
                        {t("Branch Name")}
                      </th>
                      <th className="border border-slate-200 p-3 font-bold text-[#475569]">
                        {t("Company")}
                      </th>
                      <th className="border border-slate-200 p-3 font-bold text-[#475569]">
                        {t("Phone")}
                      </th>
                      <th className="border border-slate-200 p-3 font-bold text-[#475569]">
                        {t("Compliance Score")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {allBranches?.map((branch, index) => (
                      <tr
                        key={branch.id}
                        className={
                          index % 2 === 1
                            ? "bg-slate-50/30"
                            : ""
                        }
                      >
                        <td className="border border-slate-200 p-3 font-medium">
                          {branch.name}
                        </td>
                        <td className="border border-slate-200 p-3">
                          {branch.company?.name || "-"}
                        </td>
                        <td className="border border-slate-200 p-3">
                          {branch.phone}
                        </td>
                        <td className="border border-slate-200 p-3 font-bold text-[#0F172A]">
                          {branch.compliance_score}%
                        </td>
                      </tr>
                    ))}
                    {(!allBranches ||
                      allBranches.length === 0) && (
                      <tr>
                        <td
                          colSpan={4}
                          className="border border-slate-200 p-6 text-center text-slate-400 italic"
                        >
                          {t("No data available")}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </section>

              {/* Grid for Auditors and Users to save space */}
              <div className="grid grid-cols-2 gap-10">
                {/* All Auditors */}
                <section className="flex flex-col gap-4">
                  <h3 className="text-xl font-bold text-[#1E293B] border-b-2 border-slate-200 pb-2">
                    {t("All Auditors")}
                  </h3>
                  <table className="w-full border-collapse border border-slate-200 text-xs text-right shadow-sm">
                    <thead>
                      <tr className="bg-slate-50 text-right">
                        <th className="border border-slate-200 p-3 font-bold text-[#475569]">
                          {t("Name")}
                        </th>
                        <th className="border border-slate-200 p-3 font-bold text-[#475569]">
                          {t("Email")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {allAuditors?.map(
                        (auditor, index) => (
                          <tr
                            key={auditor.id}
                            className={
                              index % 2 === 1
                                ? "bg-slate-50/30"
                                : ""
                            }
                          >
                            <td className="border border-slate-200 p-3 font-medium">
                              {auditor.name}
                            </td>
                            <td className="border border-slate-200 p-3 text-slate-500">
                              {auditor.email}
                            </td>
                          </tr>
                        ),
                      )}
                      {(!allAuditors ||
                        allAuditors.length === 0) && (
                        <tr>
                          <td
                            colSpan={2}
                            className="border border-slate-200 p-6 text-center text-slate-400 italic"
                          >
                            {t("No data available")}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </section>

                {/* All Users (Summary) */}
                <section className="flex flex-col gap-4">
                  <h3 className="text-xl font-bold text-[#1E293B] border-b-2 border-slate-200 pb-2">
                    {t("All Users")}
                  </h3>
                  <table className="w-full border-collapse border border-slate-200 text-xs text-right shadow-sm">
                    <thead>
                      <tr className="bg-slate-50 text-right">
                        <th className="border border-slate-200 p-3 font-bold text-[#475569]">
                          {t("Name")}
                        </th>
                        <th className="border border-slate-200 p-3 font-bold text-[#475569]">
                          {t("Role")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {allUsers?.map((user, index) => (
                        <tr
                          key={user.id}
                          className={
                            index % 2 === 1
                              ? "bg-slate-50/30"
                              : ""
                          }
                        >
                          <td className="border border-slate-200 p-3 font-medium">
                            {user.name}
                          </td>
                          <td className="border border-slate-200 p-3 text-slate-500 capitalize">
                            {t(user.role?.[0] || "User")}
                          </td>
                        </tr>
                      ))}
                      {(!allUsers ||
                        allUsers.length === 0) && (
                        <tr>
                          <td
                            colSpan={2}
                            className="border border-slate-200 p-6 text-center text-slate-400 italic"
                          >
                            {t("No data available")}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </section>
              </div>
            </div>

            {/* Table 5: Latest Visits */}
            {/* Table 6: Latest Tickets */}
            {/* These sections are moved to "Section 3: Recent Activity" below */}

            {/* Section 3: Recent Activity */}
            <div className="flex flex-col gap-12 pt-4 border-t-2 border-slate-100">
              <section className="flex flex-col gap-4">
                <h3 className="text-xl font-bold text-[#1E293B] py-2 bg-slate-50 border-r-4 border-[#0F172A] pr-3">
                  {t("Latest Visits")}
                </h3>
                <table className="w-full border-collapse border border-slate-200 text-xs text-right shadow-sm">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="border border-slate-200 p-3 font-bold text-[#334155]">
                        ID
                      </th>
                      <th className="border border-slate-200 p-3 font-bold text-[#334155]">
                        {t("Branch Name")}
                      </th>
                      <th className="border border-slate-200 p-3 font-bold text-[#334155]">
                        {t("Auditor Name")}
                      </th>
                      <th className="border border-slate-200 p-3 font-bold text-[#334155]">
                        {t("Scheduled Date")}
                      </th>
                      <th className="border border-slate-200 p-3 font-bold text-[#334155]">
                        {t("Status")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {latestVisits?.map((visit, index) => (
                      <tr
                        key={visit.id}
                        className={
                          index % 2 === 1
                            ? "bg-slate-50/30"
                            : ""
                        }
                      >
                        <td className="border border-slate-200 p-3 font-semibold text-[#0F172A]">
                          #{visit.id}
                        </td>
                        <td className="border border-slate-200 p-3">
                          {visit.branch?.name}
                        </td>
                        <td className="border border-slate-200 p-3">
                          {visit.auditor?.name}
                        </td>
                        <td className="border border-slate-200 p-3 font-medium">
                          {visit.scheduled_date}
                        </td>
                        <td className="border border-slate-200 p-3 capitalize font-semibold">
                          {visit.status_text}
                        </td>
                      </tr>
                    ))}
                    {(!latestVisits ||
                      latestVisits.length === 0) && (
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

              <section className="flex flex-col gap-4">
                <h3 className="text-xl font-bold text-[#1E293B] py-2 bg-slate-50 border-r-4 border-[#0F172A] pr-3">
                  {t("Latest Tickets")}
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
                    {latestTickets?.map((ticket, index) => (
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
                          {ticket.creator?.name}
                        </td>
                        <td className="border border-slate-200 p-3 font-medium">
                          {ticket.subject}
                        </td>
                        <td className="border border-slate-200 p-3 capitalize">
                          <span
                            className={`${ticket.priority === "critical" || ticket.priority === "high" ? "text-red-700 font-bold" : ""}`}
                          >
                            {t(ticket.priority)}
                          </span>
                        </td>
                        <td className="border border-slate-200 p-3 capitalize font-semibold">
                          {t(ticket.status)}
                        </td>
                      </tr>
                    ))}
                    {(!latestTickets ||
                      latestTickets.length === 0) && (
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
            </div>
          </div>
        </DocumentTemplate>
      </div>
    );
  },
);

AdminReports.displayName = "AdminReports";

export default AdminReports;
