import { Layout, Navbar, Footer } from "nextra-theme-docs";
import { getPageMap } from "nextra/page-map";
import { DocsLanguageSwitch } from "@/components/docs/language-switch";
import { DocsHtmlSync } from "@/components/docs/html-sync";
import "nextra-theme-docs/style.css";

export const metadata = {
  title: {
    template: "%s | توثيق استقرار",
    default: "وثائق استقرار",
  },
  description:
    "توثيق شامل للمطورين والبنية المعمارية لمنصة استقرار للتدقيق والجودة.",
};

const isDev = process.env.NODE_ENV === "development";

export default async function ArDocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pageMap = await getPageMap("/docs/ar");

  return (
    <>
      {/* Patches <html lang="ar" dir="rtl"> on the shared root <html> element */}
      <DocsHtmlSync lang="ar" dir="rtl" />
      <Layout
        navbar={
          <Navbar
            logo={
              <span className="font-bold text-lg tracking-wide text-primary">
                منصة استقرار | التوثيق
              </span>
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
              © {new Date().getFullYear()} منصة استقرار للجودة والامتثال.
            </span>
          </Footer>
        }
      >
        {children}
      </Layout>
    </>
  );
}
