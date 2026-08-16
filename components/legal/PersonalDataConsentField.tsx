"use client";

import Link from "next/link";
import { Check } from "lucide-react";

type PersonalDataConsentFieldProps = {
  checked: boolean;
  error?: string;
  onChange: (checked: boolean) => void;
};

export const PERSONAL_DATA_CONSENT_INPUT_ID = "personal-data-consent";

export function PersonalDataConsentField({
  checked,
  error,
  onChange
}: PersonalDataConsentFieldProps) {
  const descriptionId = error
    ? "personal-data-consent-error"
    : "personal-data-consent-policy";

  return (
    <div className="py-1">
      <div className="flex items-start gap-3">
        <label
          htmlFor={PERSONAL_DATA_CONSENT_INPUT_ID}
          className="relative mt-0.5 flex size-5 shrink-0 cursor-pointer items-center justify-center sm:size-6"
        >
          <input
            id={PERSONAL_DATA_CONSENT_INPUT_ID}
            name="personalDataConsent"
            type="checkbox"
            value="accepted"
            checked={checked}
            required
            aria-invalid={Boolean(error)}
            aria-describedby={descriptionId}
            onChange={(event) => onChange(event.currentTarget.checked)}
            className="peer absolute inset-0 z-10 size-full cursor-pointer opacity-0"
          />
          <span
            className="pointer-events-none absolute inset-0 rounded-[5px] border border-smoke/55 bg-transparent transition-[background-color,border-color,box-shadow] peer-checked:border-ember peer-checked:bg-ember peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-gold-soft"
            aria-hidden
          />
          <Check
            className="pointer-events-none relative size-3.5 text-white opacity-0 transition-opacity peer-checked:opacity-100 sm:size-4"
            strokeWidth={3}
            aria-hidden
          />
          <span className="sr-only">
            Даю согласие на обработку персональных данных
          </span>
        </label>

        <p
          id="personal-data-consent-policy"
          className="min-w-0 text-sm leading-relaxed text-smoke sm:text-[15px]"
        >
          Я ознакомлен(а) с{" "}
          <Link
            href="/policy"
            target="_blank"
            rel="noopener noreferrer"
            prefetch={false}
            className="focus-ring font-semibold text-gold-soft underline decoration-1 decoration-current underline-offset-2 transition-colors hover:text-ember-soft"
          >
            Политикой конфиденциальности
          </Link>{" "}
          и{" "}
          <span className="whitespace-normal">
            <Link
              href="/consent"
              target="_blank"
              rel="noopener noreferrer"
              prefetch={false}
              className="focus-ring font-semibold text-gold-soft underline decoration-1 decoration-current underline-offset-2 transition-colors hover:text-ember-soft"
            >
              даю согласие на обработку персональных данных
            </Link>
            .
          </span>
        </p>
      </div>

      {error ? (
        <p
          id="personal-data-consent-error"
          className="mt-2 pl-8 text-xs font-bold leading-relaxed text-red-300 sm:pl-9"
          role="alert"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
