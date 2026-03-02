import { useTranslations } from "next-intl";
import React from "react";
import { useGetTicketsStatsQuery } from "@/services/api/tickets";
import { StatsCardProps } from "@/types/stats-card-props";
import { motion } from "motion/react";
import {
  BookOpenCheck,
  CaptionsOff,
  CircleCheckBig,
  Clock,
  Hourglass,
  Ticket,
} from "lucide-react";
import StatsSection from "@/components/common/stats-section/stats";
import StatsCard from "../stats-card/stats-card";

const TicketsStats = () => {
  const t = useTranslations();
  const { data: stats, isLoading } =
    useGetTicketsStatsQuery({});

  const statsConfig: StatsCardProps[] = [
    {
      title: stats?.total_tickets,
      subtitle: t("Total Tickets"),
      icon: <Ticket />,
      Badge: {
        variant: "secondary",
        className: "bg-green-100 text-green-700",
        badgeTitle: "+6",
        badgeIcon: <></>,
      },
    },
    {
      title: stats?.open_tickets,
      subtitle: t("Open Tickets"),
      icon: <BookOpenCheck />,
      Badge: {
        variant: "secondary",
        className: "bg-gray-100 text-gray-700",
        badgeTitle: "",
        badgeIcon: <CircleCheckBig />,
      },
    },
    {
      title: stats?.in_progress_tickets,
      subtitle: t("In Progress Tickets"),
      icon: <Hourglass />,
      Badge: {
        variant: "secondary",
        className: "bg-cyan-500/10 text-cyan-700",
        badgeTitle: "",
        badgeIcon: <Clock />,
      },
    },
    {
      title: stats?.closed_tickets,
      subtitle: t("Average rating"),
      icon: <CaptionsOff />,
      Badge: {
        variant: "secondary",
        className: "bg-blue-100 text-blue-700",
        badgeTitle: "",
        badgeIcon: <></>,
      },
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {statsConfig.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.1 }} // Optional: stagger animation
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
  );
};

export default TicketsStats;
