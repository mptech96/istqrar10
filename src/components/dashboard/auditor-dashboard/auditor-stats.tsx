"use client";
import { StatsCardProps } from "@/types/stats-card-props";
import { useTranslations } from "next-intl";
import {
  CircleCheckBig,
  Calendar,
  Store,
  TrendingUp,
  Users,
  Star,
  Binoculars,
  Clock,
} from "lucide-react";
import { useGetVisitsQuery } from "@/services/api/visits";
import { useAppSelector } from "@/lib/store";
import StatsSection from "@/components/common/stats-section/stats";
import { Visit } from "@/types/visit";
import { useLoader } from "@/hooks/use-loader";
import { useCallback, useEffect, useState } from "react";
import { number } from "zod";

interface AuditorStats {
  totalVisits: number;
  completedVisits: Visit[];
  pendingVisits: Visit[];
  inProgressVisits: Visit[];
  cancelledVisits: Visit[];
  averagePercentage: number;
}

const AuditorStats = () => {
  const t = useTranslations();
  const { start, stop } = useLoader();
  const { user } = useAppSelector((state) => state.auth);
  const [stats, setStats] = useState<AuditorStats>({
    totalVisits: 0,
    completedVisits: [],
    pendingVisits: [],
    inProgressVisits: [],
    cancelledVisits: [],
    averagePercentage: 0,
  });
  const query = new URLSearchParams({
    page: "1",
    limit: "100",
    auditor_id: String(user?.id),
  });

  const { data, isLoading } = useGetVisitsQuery(
    query.toString(),
  );

  useEffect(() => {
    if (isLoading) {
      start();
    }
    if (!isLoading) {
      stop();
    }
  }, [isLoading, start, stop]);

  const getAuditorStats = useCallback(() => {
    const completedVisits = data?.data?.filter(
      (visit: Visit) => visit.status === "completed",
    );
    const totalVisits = data?.data?.length;
    const pendingVisits = data?.data?.filter(
      (visit: Visit) => visit.status === "in_progress",
    );

    const inProgressVisits = data?.data?.filter(
      (visit: Visit) => visit.status === "in_progress",
    );
    const cancelledVisits = data?.data?.filter(
      (visit: Visit) => visit.status === "scheduled",
    );
    /*  if (!completedVisits || completedVisits.length === 0)
      return {
        totalVisits,
        completedVisits,
        pendingVisits,
        inProgressVisits,
        cancelledVisits,
        averagePercentage: 0,
      }; */
    const averagePercentage =
      pendingVisits?.reduce((acc: number, visit: Visit) => {
        return acc + (visit.percentage || 0);
      }, 0) / pendingVisits?.length;

    return {
      totalVisits,
      completedVisits,
      pendingVisits,
      inProgressVisits,
      cancelledVisits,
      averagePercentage,
    };
  }, [data]);

  const statsConfig: StatsCardProps[] = [
    {
      title: data?.meta?.total,
      subtitle: t("Total visits"),
      icon: <Binoculars />,
      Badge: {
        variant: "secondary",
        className: "bg-green-100 text-green-700",
        badgeTitle: "+6",
        badgeIcon: <Binoculars />,
      },
    },
    {
      title: getAuditorStats()?.completedVisits?.length,
      subtitle: t("Completed visits"),
      icon: <CircleCheckBig />,
      Badge: {
        variant: "secondary",
        className: "bg-cyan-500/10 text-cyan-700",
        badgeTitle: "",
        badgeIcon: <CircleCheckBig />,
      },
    },
    {
      title: getAuditorStats()?.inProgressVisits?.length,
      subtitle: t("Pending visits"),
      icon: <Clock />,
      Badge: {
        variant: "secondary",
        className: "bg-amber-500/10 text-amber-700",
        badgeTitle: "+2",
        badgeIcon: <TrendingUp />,
      },
    },
    {
      title: getAuditorStats()?.averagePercentage,
      subtitle: t("Average visit rating"),
      icon: <Star />,
      Badge: {
        variant: "secondary",
        className: "bg-blue-100 text-blue-700",
        badgeTitle: "2%",
        badgeIcon: <TrendingUp />,
      },
    },
  ];
  return <StatsSection statsConfig={statsConfig} />;
};

export default AuditorStats;
