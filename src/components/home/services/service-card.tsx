"use client";
import React from "react";
import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";

interface ServiceCardProps {
  title: string;
  icon: LucideIcon;
  index: number;
}

const ServiceCard = ({ title, icon: Icon, index }: ServiceCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group relative pt-10"
    >
      {/* Badge Icon */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20">
        <div className="relative w-14 h-14 rotate-45 rounded-xl bg-coralRed flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
          <div className="-rotate-45">
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* Main Card */}
      <div className="relative h-full px-6 py-12 bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800 flex items-center justify-center text-center transition-all duration-500 overflow-hidden group-hover:shadow-2xl group-hover:shadow-coralRed/20">
        {/* Hover Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-br from-coralRed to-darkRed opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <h3 className="relative z-10 text-lg font-bold text-zinc-800 dark:text-zinc-100 group-hover:text-white transition-colors duration-300 leading-relaxed">
          {title}
        </h3>
      </div>
    </motion.div>
  );
};

export default ServiceCard;
