import BranchStats from "@/components/dashboard/branch-dashboard/branch-stats";
import Header from "@/components/dashboard/header/header";
import React from "react";

const BranchDashboard = () => {
  return (
    <section className="flex flex-col gap-6">
      <Header
        title="Dashboard"
        description="branch dashboard showing branch stats ,users ,visits ,reports and more"
      />
      <BranchStats />
    </section>
  );
};

export default BranchDashboard;
