"use client";

import { useEffect } from "react";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const MAX_DELAY_SECONDS = 0.16;

export function MotionReveal() {
  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]")
    );
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      elements.forEach((element) => {
        element.dataset.revealed = "true";
      });

      return;
    }

    const animations = new Set<Animation>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const element = entry.target as HTMLElement;
          observer.unobserve(element);
          if (element.dataset.revealed === "true") return;
          element.dataset.revealed = "true";

          const delay = Math.min(
            Number(element.dataset.revealDelay ?? 0) / 1000,
            MAX_DELAY_SECONDS
          );
          const animation = element.animate(
            [
              { opacity: 0.86, transform: "translate3d(0, 12px, 0)" },
              { opacity: 1, transform: "translate3d(0, 0, 0)" }
            ],
            {
              duration: 420,
              delay: delay * 1000,
              easing: `cubic-bezier(${EASE_OUT.join(",")})`,
              fill: "none"
            }
          );

          animations.add(animation);
          animation.addEventListener(
            "finish",
            () => animations.delete(animation),
            { once: true }
          );
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -10% 0px" }
    );

    elements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
    };
  }, []);

  return null;
}
