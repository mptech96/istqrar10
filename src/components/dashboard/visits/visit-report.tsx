"use client";

import { useGetVisitReportQuery } from "@/services/api/visits";
import { useParams, usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";
import { useLoader } from "@/hooks/use-loader";
import { useTranslations } from "next-intl";
import {
  BadgeQuestionMark,
  CheckCheckIcon,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import StatsCard from "../stats-card/stats-card";
import { StatsCardProps } from "@/types/stats-card-props";
import ScorePercentage from "./score-percentage";
const VisitReport = () => {
  const params = useParams();
  const { start, stop } = useLoader();
  const {
    data: visitReport,
    isSuccess,
    isLoading,
    isError,
  } = useGetVisitReportQuery(params.visitId as string);
  const t = useTranslations();

  console.log("visitReport", visitReport);
  useEffect(() => {
    if (isLoading) {
      start();
    } else {
      stop();
    }
  }, [isLoading, stop, start]);

  const statsConfig = useMemo<StatsCardProps[]>(
    () => [
      {
        title: visitReport?.data?.total_questions,
        subtitle: t("Total questions"),
        icon: <BadgeQuestionMark />,
        Badge: {
          variant: "secondary",
          className: "bg-green-100 text-green-700",
          badgeTitle: "+6",
          badgeIcon: null,
        },
      },
      {
        title: visitReport?.data?.critical_errors,
        subtitle: t("Critical errors"),
        icon: <X />,
        Badge: {
          variant: "secondary",
          className: "bg-red-100 text-red-700",
          badgeTitle: "",
          badgeIcon: null,
        },
      },
      {
        title: visitReport?.data?.correct_answers,
        subtitle: t("Correct answers"),
        icon: <CheckCheckIcon />,
        Badge: {
          variant: "secondary",
          className: "bg-cyan-500/10 text-cyan-700",
          badgeTitle: "+2",
          badgeIcon: null,
        },
      },
      {
        title: visitReport?.data?.incorrect_answers,
        subtitle: t("Incorrect answers"),
        icon: <X />,
        Badge: {
          variant: "secondary",
          className: "bg-blue-100 text-blue-700",
          badgeTitle: "2%",
          badgeIcon: null,
        },
      },
    ],
    [t, visitReport],
  );

  return (
    <section>
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="lg:w-1/3">
          <ScorePercentage
            score={visitReport?.data?.score_percentage || 0}
            label={t("Total Score")}
            className="h-full"
          />
        </div>
        <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div>
    </section>
  );
};

export default VisitReport;
