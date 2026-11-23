export const appName = "Arrumo AI Video Editor";

/** The docs are served by aidevs.pt under these paths, which this static export mirrors. */
export const siteUrl = "https://www.aidevs.pt";
export const landingRoute = "/tools/arrumo";
export const docsRoute = "/tools/arrumo/docs";
/** Scripts, styles, search, page Markdown and images, outside the language paths. */
export const staticRoute = "/tools/arrumo/static";

/** A path in the reader's language, the way aidevs.pt spells it: English has no prefix. */
export function localized(lang: string, path: string) {
  return lang === "en" ? path : `/${lang}${path}`;
}

export const gitConfig = {
  user: "aidevs-pt",
  repo: "arrumo-docs",
  branch: "main",
};
