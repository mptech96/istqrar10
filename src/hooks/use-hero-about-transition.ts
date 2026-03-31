"use client";

import { useEffect, useRef, useState } from "react";

interface UseHeroAboutTransitionReturn {
  heroRef: React.RefObject<HTMLDivElement | null>;
  aboutRef: React.RefObject<HTMLElement | null>;
  heroImageRef: React.RefObject<HTMLDivElement | null>;
  aboutImageRef: React.RefObject<HTMLDivElement | null>;
  floatingRef: React.RefObject<HTMLDivElement | null>;
  isTransitioning: boolean;
  isTransitionComplete: boolean;
}

/**
 * Hook to manage the image transition from Hero section to About section
 */
export function useHeroAboutTransition(): UseHeroAboutTransitionReturn {
  const heroRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);
  const aboutImageRef = useRef<HTMLDivElement>(null);
  const floatingRef = useRef<HTMLDivElement>(null);

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isTransitionComplete, setIsTransitionComplete] = useState(false);

  useEffect(() => {
    let animationFrameId: number;
    let isTransitioningState = false;
    let isTransitionCompleteState = false;

    const updatePosition = () => {
      const heroEl = heroRef.current;
      const heroImageEl = heroImageRef.current;
      const aboutImageEl = aboutImageRef.current;
      const floatingEl = floatingRef.current;

      if (!heroEl || !heroImageEl || !aboutImageEl || !floatingEl) {
        animationFrameId = requestAnimationFrame(updatePosition);
        return;
      }

      const heroRect = heroEl.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const visibleTop = Math.max(heroRect.top, 0);
      const visibleBottom = Math.min(heroRect.bottom, windowHeight);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);
      const visibility = heroRect.height > 0 ? visibleHeight / heroRect.height : 0;

      let progress = 0;

      if (visibility < 0.6 && visibility > 0.1) {
        if (!isTransitioningState) {
          setIsTransitioning(true);
          isTransitioningState = true;
        }
        if (isTransitionCompleteState) {
          setIsTransitionComplete(false);
          isTransitionCompleteState = false;
        }
        progress = (0.6 - visibility) / 0.5;
      } else if (visibility <= 0.1) {
        if (isTransitioningState) {
          setIsTransitioning(false);
          isTransitioningState = false;
        }
        if (!isTransitionCompleteState) {
          setIsTransitionComplete(true);
          isTransitionCompleteState = true;
        }
        progress = 1;
      } else {
        if (isTransitioningState) {
          setIsTransitioning(false);
          isTransitioningState = false;
        }
        if (isTransitionCompleteState) {
          setIsTransitionComplete(false);
          isTransitionCompleteState = false;
        }
        progress = 0;
      }

      const shouldFloat = isTransitioningState || isTransitionCompleteState;

      if (shouldFloat) {
        const hRect = heroImageEl.getBoundingClientRect();
        const aRect = aboutImageEl.getBoundingClientRect();

        const currentX = hRect.left + (aRect.left - hRect.left) * progress;
        const currentY = hRect.top + (aRect.top - hRect.top) * progress;
        const currentWidth = hRect.width + (aRect.width - hRect.width) * progress;
        const currentHeight = hRect.height + (aRect.height - hRect.height) * progress;

        floatingEl.style.display = 'block';
        floatingEl.style.opacity = '1'; // Hero image to remain fully visible at the end
        
        // Hide the About image smoothly near the end of the transition
        const aboutInner = aboutImageEl.firstElementChild as HTMLElement;
        if (aboutInner) {
          if (progress > 0.8) {
            aboutInner.style.opacity = `${1 - (progress - 0.8) / 0.2}`;
          } else {
            aboutInner.style.opacity = '1';
          }
        }
        
        floatingEl.style.left = `${currentX}px`;
        floatingEl.style.top = `${currentY}px`;
        floatingEl.style.width = `${currentWidth}px`;
        floatingEl.style.height = `${currentHeight}px`;
      } else {
        floatingEl.style.display = 'none';
        floatingEl.style.opacity = '1';
        
        // Ensure About image is visible when not transitioning
        const aboutInner = aboutImageEl.firstElementChild as HTMLElement;
        if (aboutInner) {
          aboutInner.style.opacity = '1';
        }
      }

      animationFrameId = requestAnimationFrame(updatePosition);
    };

    animationFrameId = requestAnimationFrame(updatePosition);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return {
    heroRef,
    aboutRef,
    heroImageRef,
    aboutImageRef,
    floatingRef,
    isTransitioning,
    isTransitionComplete,
  };
}
