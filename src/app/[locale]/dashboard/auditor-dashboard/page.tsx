import AuditorStats from "@/components/dashboard/auditor-dashboard/auditor-stats";
import Header from "@/components/dashboard/header/header";

const AuditorDashboard = () => {
  return (
    <section className="flex flex-col gap-4">
      <Header
        title="Dashboard"
        description="auditor dashboard showing auditor stats , visits ,reports and more"
      />
      <AuditorStats />
    </section>
  );
};

export default AuditorDashboard;
