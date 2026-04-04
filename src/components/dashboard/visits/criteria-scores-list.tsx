"use client";

import React from "react";
import { CriterionScore } from "@/types/visit-report";
import CriteriaScoreCard from "./criteria-score-card";
import { motion } from "motion/react";

interface CriteriaScoresListProps {
  scores: CriterionScore[];
}

const CriteriaScoresList: React.FC<CriteriaScoresListProps> = ({ scores }) => {
  if (!scores || scores.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {scores.map((score, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.05, duration: 0.3 }}
        >
          <CriteriaScoreCard score={score} />
        </motion.div>
      ))}
    </div>
  );
};

export default CriteriaScoresList;
