import NewEntityButton from "@/components/common/new-entity-button/button";
import CompaniesDataTable from "@/components/dashboard/companies/companies-data-table";
import CreateCompanyModel from "@/components/dashboard/companies/create-company-model";
import CompaniesStats from "@/components/dashboard/companies/stats";
import Header from "@/components/dashboard/header/header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";

const Companies = () => {
  return (
    <section className="flex flex-col gap-4">
      <header className="flex items-center justify-between">
        <Header
          title="Companies"
          description="show all companies in the system , with reports"
        />

        <CreateCompanyModel />
      </header>
      <div>
        <CompaniesStats />
        <div className="mt-6">
          <CompaniesDataTable />
        </div>
      </div>
    </section>
  );
};

export default Companies;
