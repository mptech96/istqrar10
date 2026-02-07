import CompaniesDataTable from "@/components/dashboard/companies/companies-data-table";
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

        <div className="">
          <Link href="/dashboard/companies/new">
            <Button className="bg-[rgba(248,142,140,0.97)] text-white hover:bg-coralRed cursor-pointer py-4 ">
              Add Company
            </Button>
          </Link>
        </div>
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
