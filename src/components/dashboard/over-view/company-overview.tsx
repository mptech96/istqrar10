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

const CompanyOverview = () => {
  const t = useTranslations();

  const statsConfig: StatsCardProps[] = [
    {
      title: "5",
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
      title: "10",
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
      title: "20",
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
      title: "20%",
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
    </section>
  );
};

export default CompanyOverview;
