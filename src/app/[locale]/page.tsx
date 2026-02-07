import About from "@/components/home/about/about";
import Advantages from "@/components/home/advantages/advantages";
import Contact from "@/components/home/contact-us/contact";
import Footer from "@/components/home/footer/footer";
import HeroSection from "@/components/home/hero/hero-section";
import NavBar from "@/components/home/nav-bar/navbar";
import Services from "@/components/home/services/services";

export default function Home() {
  return (
    <>
      <NavBar />
      <main className=" flex flex-col space-y-20">
        <div id="home">
          <HeroSection />
        </div>

        <div id="services">
          <Services />
        </div>

        <div className="w-[90%] mx-auto flex flex-col space-y-20">
          <div id="about">
            <Advantages />
            <About />
          </div>
          <div id="contact">
            <Contact />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
