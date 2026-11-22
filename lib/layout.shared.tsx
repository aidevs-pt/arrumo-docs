import { uiTranslations } from "fumadocs-ui/i18n";
import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { i18n } from "./i18n";
import { appName, gitConfig } from "./shared";
import ui from "./ui-translations.json";

export const translations = i18n
  .translations()
  .extend(uiTranslations())
  .add({
    en: { displayName: "English" },
    es: ui.es,
    pt: ui.pt,
  });

export function baseOptions(lang: string): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span className="flex items-center gap-2 font-semibold">
          {/* biome-ignore lint/performance/noImgElement: static export has no image optimizer */}
          <img
            src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/icon.svg`}
            alt=""
            width={22}
            height={22}
          />
          {appName}
        </span>
      ),
      url: `/${lang}`,
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
    i18n: true,
  };
}
