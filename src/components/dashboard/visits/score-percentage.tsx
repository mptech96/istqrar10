"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface ScorePercentageProps {
  score: number;
  label?: string;
  className?: string;
  size?: number;
  strokeWidth?: number;
}

const ScorePercentage = ({
  score = 0,
  label,
  className = "",
  size = 160,
  strokeWidth = 12,
}: ScorePercentageProps) => {
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    // Animate to target score
    const timeout = setTimeout(() => {
      setPercentage(score);
    }, 100);
    return () => clearTimeout(timeout);
  }, [score]);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset =
    circumference - (percentage / 100) * circumference;

  // Determine color based on score
  const getColor = (val: number) => {
    if (val >= 80) return "text-green-500";
    if (val >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  const getGradient = (val: number) => {
    if (val >= 80) return "url(#green-gradient)";
    if (val >= 50) return "url(#yellow-gradient)";
    return "url(#red-gradient)";
  };

  return (
    <div
      className={`flex flex-col items-center justify-center p-6 bg-white dark:bg-zinc-950 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 ${className}`}
    >
      <div
        className="relative"
        style={{ width: size, height: size }}
      >
        {/* Background Circle */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-zinc-100 dark:text-zinc-800"
          />
          {/* Progress Circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={getGradient(score)}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
            className="drop-shadow-[0_0_8px_rgba(0,0,0,0.1)]"
          />

          {/* Gradients */}
          <defs>
            <linearGradient
              id="green-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#16a34a" />
            </linearGradient>
            <linearGradient
              id="yellow-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#ca8a04" />
            </linearGradient>
            <linearGradient
              id="red-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`text-3xl font-bold ${getColor(score)} tracking-tight`}
          >
            {Math.round(percentage)}%
          </motion.span>
          {label && (
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider mt-1">
              {label}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScorePercentage;
