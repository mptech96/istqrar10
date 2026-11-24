import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function DocsRootPage() {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value;
  const locale = cookieLocale === "en" ? "en" : "ar";
  redirect(`/docs/${locale}`);
}
