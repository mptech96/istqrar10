import Header from "@/components/dashboard/header/header";
import { OverView } from "@/components/dashboard/over-view/over-view";

const Overview = () => {
  return (
    <section className="flex flex-col gap-4">
      <Header title="dashboard" description="overview" />
      <OverView />
    </section>
  );
};

export default Overview;
