"use client";
import StatsSection from "@/components/common/stats-section/stats";
import { StatsCardProps } from "@/types/stats-card-props";
import {
  CircleCheckBig,
  Star,
  Store,
  Telescope,
  TrendingUp,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";
import BranchesDataTable from "../branches/branches-data-table";
import VisitsDataTable from "../visits/visits-data-table";
import { useGetCompanyDashboardQuery } from "@/services/api/stats";

const CompanyOverview = () => {
  const t = useTranslations();
  const { data: companyDashboard } = useGetCompanyDashboardQuery({});
  const statsConfig: StatsCardProps[] = [
    {
      title: companyDashboard?.statistics?.branches_count,
      subtitle: t("Total Branches"),
      icon: <Store />,
      Badge: {
        variant: "secondary",
        className: "bg-green-100 text-green-700",
        badgeTitle: "+6",
        badgeIcon: <TrendingUp />,
      },
    },
    {
      title: companyDashboard?.statistics?.branch_managers_count,
      subtitle: t("Total users"),
      icon: <Users />,
      Badge: {
        variant: "secondary",
        className: "bg-gray-100 text-gray-700",
        badgeTitle: "",
        badgeIcon: <CircleCheckBig />,
      },
    },
    {
      title: companyDashboard?.statistics?.total_visits,
      subtitle: t("Total Visits"),
      icon: <Telescope />,
      Badge: {
        variant: "secondary",
        className: "bg-cyan-500/10 text-cyan-700",
        badgeTitle: "+2",
        badgeIcon: <TrendingUp />,
      },
    },
    {
      title: companyDashboard?.statistics?.avg_company_score,
      subtitle: t("Average rating"),
      icon: <Star />,
      Badge: {
        variant: "secondary",
        className: "bg-blue-100 text-blue-700",
        badgeTitle: "2%",
        badgeIcon: <TrendingUp />,
      },
    },
  ];
  return (
    <section className="flex flex-col gap-4">
      <StatsSection statsConfig={statsConfig} />
      <BranchesDataTable />
      <VisitsDataTable />
    </section>
  );
};

export default CompanyOverview;
