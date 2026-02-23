import Header from "@/components/dashboard/header/header";
import CompanyOverview from "@/components/dashboard/over-view/company-overview";
import React from "react";

const CompanyDashboard = () => {
  return (
    <section className="flex flex-col gap-4">
      <Header title="dashboard" description="overview" />
      <CompanyOverview />
    </section>
  );
};

export default CompanyDashboard;
