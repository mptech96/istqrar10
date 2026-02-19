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
import { useEffect } from "react";

const AuditorStats = () => {
  const t = useTranslations();
  const { start, stop } = useLoader();
  const { user } = useAppSelector((state) => state.auth);
  const query = new URLSearchParams({
    page: "1",
    limit: "100",
    auditor_id: String(user?.id),
  });

  const { data, isLoading } = useGetVisitsQuery(
    query.toString(),
  );
  console.log("auditor visits", data);

  useEffect(() => {
    if (isLoading) {
      start();
    }
    if (!isLoading) {
      stop();
    }
  }, [isLoading, start, stop]);
  const getAuditorStats = (
    data: Visit[],
  ): {
    totalVisits: number;
    completedVisits: Visit[];
    pendingVisits: Visit[];
    inProgressVisits: Visit[];
    cancelledVisits: Visit[];
    averagePercentage: number;
  } => {
    const completedVisits = data?.filter(
      (visit: Visit) => visit.status === "completed",
    );
    const totalVisits = data?.length;
    const pendingVisits = data?.filter(
      (visit: Visit) => visit.status === "pending",
    );
    const inProgressVisits = data?.filter(
      (visit: Visit) => visit.status === "in_progress",
    );
    const cancelledVisits = data?.filter(
      (visit: Visit) => visit.status === "cancelled",
    );
    if (!completedVisits || completedVisits.length === 0)
      return {
        totalVisits,
        completedVisits,
        pendingVisits,
        inProgressVisits,
        cancelledVisits,
        averagePercentage: 0,
      };
    const averagePercentage =
      completedVisits.reduce(
        (acc: number, visit: Visit) =>
          acc + (visit.percentage || 0),
        0,
      ) / completedVisits.length;

    return {
      totalVisits,
      completedVisits,
      pendingVisits,
      inProgressVisits,
      cancelledVisits,
      averagePercentage,
    };
  };

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
      title: getAuditorStats(data?.data).completedVisits
        ?.length,
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
      title: getAuditorStats(data?.data).pendingVisits
        ?.length,
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
      title: getAuditorStats(data?.data).averagePercentage,
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
