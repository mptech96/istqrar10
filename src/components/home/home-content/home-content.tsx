"use client";

import { useHeroAboutTransition } from "@/hooks/use-hero-about-transition";
import HeroSection from "@/components/home/hero/hero-section";
import About from "@/components/home/about/about";
import Services from "@/components/home/services/services";
import PricingSection from "@/components/home/pricing/pricing-section";
import Contact from "@/components/home/contact-us/contact";

export default function HomeContent() {
  const {
    heroRef,
    aboutRef,
    heroImageRef,
    aboutImageRef,
    floatingRef,
    isTransitioning,
    isTransitionComplete,
  } = useHeroAboutTransition();

  return (
    <main className="flex flex-col space-y-20">
      <div id="home" className="w-[90%] mx-auto">
        <HeroSection
          heroRef={heroRef}
          heroImageRef={heroImageRef}
          floatingRef={floatingRef}
          isTransitioning={isTransitioning}
          isTransitionComplete={isTransitionComplete}
        />
      </div>
      <div id="about" className="w-[90%] mx-auto">
        <About
          aboutRef={aboutRef}
          aboutImageRef={aboutImageRef}
          isTransitioning={isTransitioning}
          isTransitionComplete={isTransitionComplete}
        />
      </div>
      <div id="services" className="w-[90%] mx-auto">
        <Services />
      </div>
      <div id="pricing" className="w-[90%] mx-auto">
        <PricingSection />
      </div>

      <div className="w-[90%] mx-auto flex flex-col space-y-20">
        <div id="contact">
          <Contact />
        </div>
      </div>
    </main>
  );
}
