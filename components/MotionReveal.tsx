"use client";

import { animate, inView } from "motion/react";
import { useLayoutEffect } from "react";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const MAX_DELAY_SECONDS = 0.16;

export function MotionReveal() {
  useLayoutEffect(() => {
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

    const animations = new Set<{ stop: () => void }>();
    const stopObservers = elements.map((element) =>
      inView(
        element,
        () => {
          if (element.dataset.revealed === "true") return;
          element.dataset.revealed = "true";

          const delay = Math.min(
            Number(element.dataset.revealDelay ?? 0) / 1000,
            MAX_DELAY_SECONDS
          );
          const controls = animate(
            element,
            {
              opacity: [0.86, 1],
              transform: [
                "translate3d(0, 12px, 0)",
                "translate3d(0, 0, 0)"
              ]
            },
            {
              duration: 0.42,
              delay,
              ease: EASE_OUT
            }
          );

          animations.add(controls);
          void controls.then(() => {
            animations.delete(controls);
            element.style.removeProperty("opacity");
            element.style.removeProperty("transform");
            element.style.removeProperty("will-change");
          });
        },
        { amount: 0.14, margin: "0px 0px -10% 0px" }
      )
    );

    return () => {
      stopObservers.forEach((stop) => stop());
      animations.forEach((controls) => controls.stop());
    };
  }, []);

  return null;
}
