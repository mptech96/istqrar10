import CreateCompanyForm from "@/components/dashboard/companies/create-company-form";
import Header from "@/components/dashboard/header/header";

const NewCompanyPage = () => {
  return (
    <section className="space-y-6">
      <Header
        title="Create New Company"
        description="Add a new company to the system"
      />
      <CreateCompanyForm />
    </section>
  );
};

export default NewCompanyPage;
