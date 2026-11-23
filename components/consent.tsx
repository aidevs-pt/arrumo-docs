"use client";

import { useI18n } from "fumadocs-ui/contexts/i18n";
import { useEffect, useRef, useState } from "react";
import {
  CONSENT_OPEN_EVENT,
  CONSENT_STORAGE_KEY,
  CONSENT_UPDATED_EVENT,
  type ConsentChoice,
  googleConsent,
  readConsent,
} from "@/lib/consent";
import { localized } from "@/lib/shared";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
    oaiq?: (...args: unknown[]) => void;
  }
}

const copy = {
  en: {
    title: "Your privacy",
    description:
      "We use cookies to measure site usage and improve our marketing. You choose what we can use.",
    policy: "Cookie Policy",
    policyPath: "/cookies-policy",
    acceptAll: "Accept all",
    rejectAll: "Reject all",
    customize: "Customize",
    save: "Save choices",
    settings: "Cookie settings",
    necessary: [
      "Necessary",
      "Language preference and contact form security. Always on.",
    ],
    analytics: ["Analytics", "Helps us understand how the site is used."],
    marketing: ["Marketing", "Used to measure and personalize advertising."],
  },
  es: {
    title: "Tu privacidad",
    description:
      "Usamos cookies para medir el uso del sitio y mejorar nuestro marketing. Tú decides qué podemos usar.",
    policy: "Política de cookies",
    policyPath: "/politica-de-cookies",
    acceptAll: "Aceptar todas",
    rejectAll: "Rechazar todas",
    customize: "Personalizar",
    save: "Guardar elección",
    settings: "Configuración de cookies",
    necessary: [
      "Necesarias",
      "Preferencia de idioma y seguridad del formulario de contacto. Siempre activas.",
    ],
    analytics: ["Analítica", "Nos ayuda a entender cómo se usa el sitio."],
    marketing: [
      "Marketing",
      "Se usan para medir y personalizar la publicidad.",
    ],
  },
  pt: {
    title: "A sua privacidade",
    description:
      "Usamos cookies para medir a utilização do site e melhorar o nosso marketing. Você escolhe o que podemos usar.",
    policy: "Política de cookies",
    policyPath: "/politica-de-cookies",
    acceptAll: "Aceitar todos",
    rejectAll: "Rejeitar todos",
    customize: "Personalizar",
    save: "Guardar escolha",
    settings: "Definições de cookies",
    necessary: [
      "Necessários",
      "Preferência de idioma e segurança do formulário de contacto. Sempre ativos.",
    ],
    analytics: ["Análise", "Ajuda-nos a perceber como o site é utilizado."],
    marketing: ["Marketing", "Usados para medir e personalizar a publicidade."],
  },
};

type Copy = (typeof copy)["en"];
const textFor = (locale: string): Copy =>
  copy[locale as keyof typeof copy] ?? copy.en;

function Toggle({
  id,
  text,
  checked,
  disabled,
  onChange,
}: {
  id: string;
  text: string[];
  checked: boolean;
  disabled?: boolean;
  onChange?: (value: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <label htmlFor={id} className="cursor-pointer text-sm">
        <span className="block font-semibold text-white">{text[0]}</span>
        <span className="block text-neutral-400">{text[1]}</span>
      </label>
      <input
        id={id}
        type="checkbox"
        role="switch"
        aria-checked={checked}
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange?.(event.target.checked)}
        className="relative mt-1 h-5 w-9 shrink-0 cursor-pointer appearance-none rounded-full bg-neutral-700 transition before:absolute before:top-0.5 before:left-0.5 before:h-4 before:w-4 before:rounded-full before:bg-neutral-950 before:ring-1 before:ring-white/20 before:transition before:content-[''] checked:bg-white checked:before:translate-x-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  );
}

const button =
  "inline-flex cursor-pointer rounded-full px-4 py-1.5 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";
const primary = `${button} bg-white text-neutral-950 hover:bg-neutral-200`;

/** The aidevs.pt privacy panel: asks once, and reopens from "Cookie settings". */
export function ConsentBanner() {
  const { locale = "en" } = useI18n();
  const text = textFor(locale);
  const [open, setOpen] = useState(false);
  const [customize, setCustomize] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!readConsent()) setOpen(true);
    const reopen = () => {
      const stored = readConsent();
      setAnalytics(stored?.analytics ?? false);
      setMarketing(stored?.marketing ?? false);
      setCustomize(true);
      setOpen(true);
    };
    window.addEventListener(CONSENT_OPEN_EVENT, reopen);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, reopen);
  }, []);

  useEffect(() => {
    if (open && customize) panel.current?.focus();
  }, [open, customize]);

  function save(choice: ConsentChoice) {
    try {
      localStorage.setItem(
        CONSENT_STORAGE_KEY,
        JSON.stringify({ ...choice, ts: Date.now() }),
      );
    } catch {}
    window.dataLayer = window.dataLayer || [];
    window.gtag =
      window.gtag ||
      ((...args: unknown[]) => {
        window.dataLayer.push(args);
      });
    window.gtag("consent", "update", googleConsent(choice));
    window.dataLayer.push({ event: "consent_updated", ...choice });
    window.oaiq?.("consent", choice.marketing);
    window.dispatchEvent(
      new CustomEvent<ConsentChoice>(CONSENT_UPDATED_EVENT, { detail: choice }),
    );
    setOpen(false);
    setCustomize(false);
  }

  if (!open) return null;
  return (
    <div
      ref={panel}
      tabIndex={-1}
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-banner-title"
      onKeyDown={(event) => {
        if (event.key === "Escape" && readConsent()) setOpen(false);
      }}
      className="fixed inset-x-4 bottom-4 z-50 max-w-md rounded-3xl border border-white/10 bg-neutral-950 p-6 text-white shadow-2xl outline-none motion-safe:animate-[consent-in_250ms_ease-out] sm:right-auto sm:bottom-6 sm:left-6"
    >
      <h2 id="cookie-banner-title" className="text-base font-semibold">
        {text.title}
      </h2>
      <p className="mt-2 text-sm text-neutral-300">
        {text.description}{" "}
        <a
          href={localized(locale, text.policyPath)}
          className="underline underline-offset-2 hover:text-white"
        >
          {text.policy}
        </a>
      </p>
      {customize && (
        <div className="mt-5 space-y-4 border-t border-white/10 pt-5">
          <Toggle
            id="consent-necessary"
            text={text.necessary}
            checked
            disabled
          />
          <Toggle
            id="consent-analytics"
            text={text.analytics}
            checked={analytics}
            onChange={setAnalytics}
          />
          <Toggle
            id="consent-marketing"
            text={text.marketing}
            checked={marketing}
            onChange={setMarketing}
          />
        </div>
      )}
      <div className="mt-5 flex flex-wrap gap-2">
        {customize ? (
          <button
            type="button"
            className={primary}
            onClick={() => save({ analytics, marketing })}
          >
            {text.save}
          </button>
        ) : (
          <>
            <button
              type="button"
              className={primary}
              onClick={() => save({ analytics: true, marketing: true })}
            >
              {text.acceptAll}
            </button>
            <button
              type="button"
              className={primary}
              onClick={() => save({ analytics: false, marketing: false })}
            >
              {text.rejectAll}
            </button>
            <button
              type="button"
              className={`${button} text-neutral-300 hover:text-white`}
              onClick={() => setCustomize(true)}
            >
              {text.customize}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/** Reopens the privacy panel, for the sidebar footer. */
export function CookieSettingsButton() {
  const { locale = "en" } = useI18n();
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(CONSENT_OPEN_EVENT))}
      className="text-start text-sm text-fd-muted-foreground transition hover:text-fd-foreground"
    >
      {textFor(locale).settings}
    </button>
  );
}
