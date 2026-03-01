import AuditorStats from "@/components/dashboard/auditor-dashboard/auditor-stats";
import Header from "@/components/dashboard/header/header";
import VisitAreaChart from "@/components/dashboard/over-view/visit-chart";
import VisitRatingChart from "@/components/dashboard/auditor-dashboard/visit-rating-chart";

const AuditorDashboard = () => {
  return (
    <section className="flex flex-col gap-4">
      <Header
        title="Dashboard"
        description="auditor dashboard showing auditor stats , visits ,reports and more"
      />
      <AuditorStats />
      <VisitAreaChart />
      <VisitRatingChart />
    </section>
  );
};

export default AuditorDashboard;
