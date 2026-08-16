import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/Header";

type LegalPageLayoutProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function LegalPageLayout({
  title,
  description,
  children
}: LegalPageLayoutProps) {
  return (
    <>
      <Header />
      <main
        id="top"
        className="min-h-screen bg-espresso pt-[var(--header-height)]"
      >
        <header className="section-surface border-b border-gold/12 bg-charcoal py-10 sm:py-14 lg:py-18">
          <div className="container-tilda">
            <Link
              href="/"
              prefetch={false}
              className="focus-ring inline-flex min-h-11 items-center gap-2 font-bold text-gold-soft transition-colors hover:text-ember-soft"
            >
              <ArrowLeft className="size-4" aria-hidden />
              Вернуться на сайт
            </Link>
            <div className="mt-7 max-w-[920px] sm:mt-9">
              <p className="text-sm font-bold text-gold-soft">
                Правовая информация
              </p>
              <h1 className="mt-3 max-w-[900px] text-balance text-[clamp(32px,5vw,64px)] font-extrabold leading-[1.08] tracking-[-0.03em] text-flame">
                {title}
              </h1>
              <p className="mt-5 max-w-[68ch] text-pretty text-base font-medium leading-relaxed text-cream/82 sm:text-lg">
                {description}
              </p>
            </div>
          </div>
        </header>

        <section className="section-surface py-10 sm:py-14 lg:py-18">
          <article className="legal-document container-tilda">
            {children}
          </article>
        </section>
      </main>
    </>
  );
}
