import { uiTranslations } from "fumadocs-ui/i18n";
import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { i18n } from "./i18n";
import {
  appName,
  docsRoute,
  gitConfig,
  landingRoute,
  localized,
  staticRoute,
} from "./shared";
import ui from "./ui-translations.json";

export const translations = i18n
  .translations()
  .extend(uiTranslations())
  .add({
    en: { displayName: "English" },
    es: ui.es,
    pt: ui.pt,
  });

const linkText = {
  en: { landing: "Download Arrumo", company: "DEVS AI" },
  es: { landing: "Descargar Arrumo", company: "DEVS AI" },
  pt: { landing: "Descarregar o Arrumo", company: "DEVS AI" },
};

export function baseOptions(lang: string): BaseLayoutProps {
  const text = linkText[lang as keyof typeof linkText] ?? linkText.en;
  return {
    nav: {
      title: (
        <span className="flex items-center gap-2 font-semibold">
          {/* biome-ignore lint/performance/noImgElement: static export has no image optimizer */}
          <img src={`${staticRoute}/icon.svg`} alt="" width={22} height={22} />
          {appName}
        </span>
      ),
      url: localized(lang, docsRoute),
    },
    links: [
      // The landing page and the company site are other apps on aidevs.pt: full page loads.
      {
        type: "main",
        text: text.landing,
        url: localized(lang, landingRoute),
        external: true,
      },
      {
        type: "main",
        text: text.company,
        url: localized(lang, "/"),
        external: true,
      },
    ],
    githubUrl: `https://github.com/${gitConfig.user}/arrumo-video-editor`,
    i18n: true,
  };
}
