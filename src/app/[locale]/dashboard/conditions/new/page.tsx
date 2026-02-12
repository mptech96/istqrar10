import { CreateConditionsForm } from "@/components/dashboard/conditions/create-conditions-form";
import Header from "@/components/dashboard/header/header";

const NewConditionPage = () => {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-2">
        <Header
          title="New condition"
          description="Creating new condition"
        />
      </div>

      <div className="flex flex-col gap-6">
        <CreateConditionsForm />
      </div>
    </section>
  );
};

export default NewConditionPage;
