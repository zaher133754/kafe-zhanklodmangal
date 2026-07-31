"use client";

import { Suspense, useEffect, useRef } from "react";
import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";

const METRIKA_SCRIPT_URL = "https://mc.yandex.ru/metrika/tag.js";
const METRIKA_READY_EVENT = "yandex-metrika-ready";

type YandexMetrikaProps = {
  counterId: number;
};

function getInitializationScript(counterId: number) {
  const initializedCounterKey = JSON.stringify(String(counterId));
  const readyEventName = JSON.stringify(METRIKA_READY_EVENT);

  return `
    window.dataLayer = window.dataLayer || [];
    (function(m,e,t,r,i,k,a){
      m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
      m[i].l=1*new Date();
      for (var j=0;j<document.scripts.length;j++) {
        if (document.scripts[j].src===r) { return; }
      }
      k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,
      a.parentNode.insertBefore(k,a);
    })(window,document,"script",${JSON.stringify(METRIKA_SCRIPT_URL)},"ym");

    window.__yandexMetrikaInitializedCounters =
      window.__yandexMetrikaInitializedCounters || {};

    if (!window.__yandexMetrikaInitializedCounters[${initializedCounterKey}]) {
      window.ym(${counterId}, "init", {
        defer: true,
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true,
        webvisor: true,
        ecommerce: "dataLayer"
      });
      window.__yandexMetrikaInitializedCounters[${initializedCounterKey}] = true;
    }

    window.dispatchEvent(new Event(${readyEventName}));
  `;
}

function YandexMetrikaPageView({ counterId }: YandexMetrikaProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const lastSentUrlRef = useRef<string | null>(null);
  const previousUrlRef = useRef<string | null>(null);

  useEffect(() => {
    let animationFrameId: number | null = null;

    const sendHit = () => {
      if (!window.ym) {
        return;
      }

      const query = search ? `?${search}` : "";
      const url = new URL(`${pathname}${query}`, window.location.origin).href;
      const counterKey = String(counterId);
      const lastHits = (window.__yandexMetrikaLastHitByCounter ||= {});
      const lastSentUrl = lastSentUrlRef.current ?? lastHits[counterKey];

      if (lastSentUrl === url) {
        lastSentUrlRef.current = url;
        previousUrlRef.current = url;
        return;
      }

      const referer =
        (previousUrlRef.current ?? lastSentUrl ?? document.referrer) || undefined;

      window.ym(counterId, "hit", url, {
        title: document.title,
        ...(referer ? { referer } : {})
      });

      lastSentUrlRef.current = url;
      previousUrlRef.current = url;
      lastHits[counterKey] = url;
    };

    const scheduleHit = () => {
      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
      }

      animationFrameId = window.requestAnimationFrame(sendHit);
    };

    window.addEventListener(METRIKA_READY_EVENT, scheduleHit);
    scheduleHit();

    return () => {
      window.removeEventListener(METRIKA_READY_EVENT, scheduleHit);

      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, [counterId, pathname, search]);

  return null;
}

export function YandexMetrika({ counterId }: YandexMetrikaProps) {
  return (
    <>
      <Script
        id="yandex-metrika"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: getInitializationScript(counterId)
        }}
      />

      <Suspense fallback={null}>
        <YandexMetrikaPageView counterId={counterId} />
      </Suspense>

      <noscript>
        <div aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://mc.yandex.ru/watch/${counterId}`}
            alt=""
            width="1"
            height="1"
            style={{ position: "absolute", left: "-9999px" }}
          />
        </div>
      </noscript>
    </>
  );
}
