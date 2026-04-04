"use client";
import StatsSection from "@/components/common/stats-section/stats";
import { StatsCardProps } from "@/types/stats-card-props";
import React, { useMemo } from "react";
import {
  Calendar,
  ChartCandlestickIcon,
  CircleCheckBig,
  Clock,
  Star,
  Store,
  TrendingUp,
  User,
  User2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useGetBranchStatsQuery } from "@/services/api/branches";
import { useAppSelector } from "@/lib/store";
import { motion } from "motion/react";
import StatsCard from "../stats-card/stats-card";

import RatingPie from "./rating-pie";
import VisitRadialBar from "./visit-radial-bar";

import { skipToken } from "@reduxjs/toolkit/query";
import { useGetBranchVisitsQuery } from "@/services/api/visits";
import { Visit } from "@/types/visit";

const BranchStats = () => {
  const t = useTranslations();
  const { user } = useAppSelector((state) => state.auth);

  // Robust check: ID must be a number and not the string "undefined"
  const branchId = user?.branch_id;
  const { data: visits, isLoading } =
    useGetBranchVisitsQuery(String(branchId), {
      skip: !branchId,
    });
  const statsConfig: StatsCardProps[] = useMemo(
    () => [
      {
        title:
          Number(
            visits?.statistics?.average_percentage,
          ).toFixed(2) || 0,
        subtitle: t("degree of compliance with"),
        icon: <Star />,
        /*  Badge: {
        variant: "secondary",
        className: "bg-green-100 text-green-700",
        badgeTitle: "",
        badgeIcon: <User />,
      }, */
      },
      {
        title: visits?.statistics?.total_visits || 0,
        subtitle: t("Total visits"),
        icon: <CircleCheckBig />,
        Badge: {
          variant: "secondary",
          className: "bg-cyan-500/10 text-cyan-700",
          badgeTitle: "",
          badgeIcon: <CircleCheckBig />,
        },
      },
      {
        title:
          visits?.data?.filter(
            (visit: Visit) => visit.status === "completed",
          ).length || 0,
        subtitle: t("Completed visits"),
        icon: <Clock />,
        Badge: {
          variant: "secondary",
          className: "bg-amber-500/10 text-amber-700",
          badgeTitle: "+2",
          badgeIcon: <TrendingUp />,
        },
      },
      {
        title:
          Number(visits?.statistics?.average_score).toFixed(
            2,
          ) || 0,
        subtitle: t("Average visit rating"),
        icon: <ChartCandlestickIcon />,
        Badge: {
          variant: "secondary",
          className: "bg-blue-100 text-blue-700",
          badgeTitle: "2%",
          badgeIcon: <TrendingUp />,
        },
      },
    ],
    [visits, t],
  );

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {statsConfig.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatsCard
              title={stat.title}
              subtitle={stat.subtitle}
              icon={stat.icon}
              Badge={stat.Badge}
            />
          </motion.div>
        ))}
      </div>
      <div className="">
        <RatingPie />
      </div>
      {/* <VisitRadialBar /> */}
    </div>
  );
};

export default BranchStats;
