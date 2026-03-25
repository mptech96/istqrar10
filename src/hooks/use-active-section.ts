"use client";

import { useState, useEffect, useTransition } from "react";

export function useActiveSection(sectionIds: string[]) {
  const [activeSection, setActiveSection] = useState<string>("");
  const [, startTransition] = useTransition();

  useEffect(() => {
    

    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: "-20% 0px -60% 0px", // Focus on the upper-middle area
      threshold: [0, 0.1, 0.5, 0.9, 1],
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      // Find the most intersecting entry
      const mostVisible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (mostVisible) {
        const id = mostVisible.target.id;
        
        
        startTransition(() => {
          setActiveSection(id);
          if (typeof window !== "undefined") {
            const hash = `#${id}`;
            if (window.location.hash !== hash) {
              window.history.replaceState(null, "", hash);
            }
          }
        });
      }
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      } else {
        console.warn("[useActiveSection] Element not found:", id);
      }
    });

    return () => observer.disconnect();
  }, [sectionIds]);

  return activeSection;
}


