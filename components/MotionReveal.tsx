"use client";

import { animate, inView } from "motion/react";
import { useLayoutEffect } from "react";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export function MotionReveal() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]")
    );
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    root.classList.add("motion-ready");

    if (prefersReducedMotion) {
      elements.forEach((element) => {
        element.dataset.revealed = "true";
      });

      return () => root.classList.remove("motion-ready");
    }

    const animations = new Set<{ stop: () => void }>();
    const stopObservers = elements.map((element) =>
      inView(
        element,
        () => {
          const delay = Number(element.dataset.revealDelay ?? 0) / 1000;
          const controls = animate(
            element,
            {
              opacity: 1,
              transform: "translate3d(0, 0, 0) scale(1)",
              filter: "blur(0px)"
            },
            {
              duration: 0.82,
              delay,
              ease: EASE_OUT
            }
          );

          animations.add(controls);
          void controls.then(() => {
            animations.delete(controls);
            element.dataset.revealed = "true";
            element.style.removeProperty("opacity");
            element.style.removeProperty("transform");
            element.style.removeProperty("filter");
            element.style.removeProperty("will-change");
          });
        },
        { amount: 0.14, margin: "0px 0px -10% 0px" }
      )
    );

    return () => {
      stopObservers.forEach((stop) => stop());
      animations.forEach((controls) => controls.stop());
      root.classList.remove("motion-ready");
    };
  }, []);

  return null;
}
