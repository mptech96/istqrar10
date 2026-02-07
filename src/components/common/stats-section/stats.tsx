import StatsCard from "@/components/dashboard/stats-card/stats-card";
import { StatsCardProps } from "@/types/stats-card-props";
import { motion } from "motion/react";

const StatsSection = ({
  statsConfig,
}: {
  statsConfig: StatsCardProps[];
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
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

export default StatsSection;
