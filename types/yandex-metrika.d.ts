type YandexMetrikaInitOptions = {
  accurateTrackBounce: boolean;
  clickmap: boolean;
  defer: boolean;
  ecommerce: string;
  trackLinks: boolean;
  webvisor: boolean;
};

type YandexMetrikaHitOptions = {
  referer?: string;
  title: string;
};

interface YandexMetrikaFunction {
  (
    counterId: number,
    method: "init",
    options: YandexMetrikaInitOptions
  ): void;
  (
    counterId: number,
    method: "hit",
    url: string,
    options: YandexMetrikaHitOptions
  ): void;
  a?: IArguments[];
  l?: number;
}

declare global {
  interface Window {
    __yandexMetrikaInitializedCounters?: Record<string, boolean>;
    __yandexMetrikaLastHitByCounter?: Record<string, string>;
    dataLayer?: Array<Record<string, unknown>>;
    ym?: YandexMetrikaFunction;
  }
}

export {};
