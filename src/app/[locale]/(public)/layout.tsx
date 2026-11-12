import NavBar from "@/components/home/nav-bar/navbar";
import Footer from "@/components/home/footer/footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavBar />
      {children}
      <Footer />
    </>
  );
}
