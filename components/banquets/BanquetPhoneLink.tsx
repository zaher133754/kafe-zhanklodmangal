"use client";

import { LazyMotion, m, useReducedMotion } from "motion/react";
import { site } from "@/lib/site";

const loadMotionFeatures = () =>
  import("@/components/banquets/motion-features").then(
    (module) => module.default
  );

const hoverTransition = {
  duration: 0.22,
  ease: [0.22, 1, 0.36, 1] as const
};

export function BanquetPhoneLink() {
  const reduceMotion = useReducedMotion();

  return (
    <LazyMotion features={loadMotionFeatures} strict>
      <m.a
        href={site.orderPhone.href}
        className="orange-link focus-ring mt-7 inline-flex min-h-14 items-center text-[clamp(1.7rem,4.4vw,3.7rem)] font-extrabold leading-none tracking-[-0.02em]"
        whileHover={reduceMotion ? undefined : { y: -3, scale: 1.015 }}
        whileTap={reduceMotion ? undefined : { scale: 0.985 }}
        transition={hoverTransition}
      >
        {site.orderPhone.label}
      </m.a>
    </LazyMotion>
  );
}
