import { Layout, Navbar, Footer } from "nextra-theme-docs";
import { getPageMap } from "nextra/page-map";
import { DocsLanguageSwitch } from "@/components/docs/language-switch";
import { DocsHtmlSync } from "@/components/docs/html-sync";
import "nextra-theme-docs/style.css";
import Link from "next/link";
import { ThemeLogo } from "@/components/ui/theme-logo";

export const metadata = {
  title: {
    template: "%s | Istqrar Documentation",
    default: "Istqrar Documentation",
  },
  description:
    "Comprehensive developer and architecture documentation for the Istqrar Inspection & Quality Auditing Platform.",
};

const isDev = process.env.NODE_ENV === "development";

export default async function EnDocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pageMap = await getPageMap("/docs/en");

  return (
    <>
      {/* Patches <html lang="en" dir="ltr"> on the shared root <html> element */}
      <DocsHtmlSync lang="en" dir="ltr" />
      <Layout
        navbar={
          <Navbar
            logo={
              <div>
                <span className="font-bold text-lg tracking-wide text-primary">
                  Istqrar Docs
                </span>
              </div>
            }
          >
            <DocsLanguageSwitch />
          </Navbar>
        }
        search={isDev ? null : undefined}
        pageMap={pageMap}
        docsRepositoryBase="https://github.com/reus/istqrar-app"
        footer={
          <Footer>
            <span>
              © {new Date().getFullYear()} Istqrar Platform. Inspection &
              Quality Auditing Platform.
            </span>
          </Footer>
        }
      >
        {children}
      </Layout>
    </>
  );
}
