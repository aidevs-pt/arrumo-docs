import { posix } from "node:path";
import { llms, loader } from "fumadocs-core/source";
import { metaSchema, pageSchema } from "fumadocs-core/source/schema";
import { defineDocs } from "fumadocs-mdx/macro";
import { icons } from "lucide-react";
import { createElement } from "react";
import { i18n } from "./i18n";
import { docsRoute, markdownPath, siteUrl } from "./shared";

const docs = defineDocs({
  dir: "content/docs",
  docs: {
    schema: pageSchema,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

export const source = loader({
  baseUrl: docsRoute,
  i18n,
  source: docs.toFumadocsSource(),
  // Pages and folders name a Lucide icon (`icon: Clapperboard`) for the sidebar and cards.
  icon(name) {
    if (name && name in icons) {
      return createElement(icons[name as keyof typeof icons]);
    }
  },
});

/** Content links to other pages by relative file path (`../plugins/index.mdx`). This finds the
 * page in the same language, so the site and the Markdown can link to its address instead. */
export function linkedPage(href: string, from: string, lang: string) {
  const file = href.split("#", 1)[0];
  if (!/\.mdx?$/.test(file)) return undefined;
  // Page paths include the language folder (`pt/user/brand.mdx`).
  const within = from.startsWith(`${lang}/`)
    ? from.slice(lang.length + 1)
    : from;
  const path = posix.normalize(posix.join(posix.dirname(within), file));
  const slugs = path
    .replace(/\.mdx?$/, "")
    .split("/")
    .filter((part) => part && part !== "index");
  return source.getPage(slugs, lang);
}

/** Markdown for agents: relative page links become the linked page's Markdown address, and
 * site paths (images, videos) become full addresses. */
function absoluteLinks(markdown: string, from: string, lang: string) {
  return markdown.replace(/\]\(([^)\s]+)\)/g, (whole, href: string) => {
    if (href.startsWith("/")) return `](${siteUrl}${href})`;
    if (/^([a-z]+:|#)/i.test(href)) return whole;
    const target = linkedPage(href, from, lang);
    if (!target) return whole;
    const hash = href.includes("#") ? `#${href.split("#")[1]}` : "";
    return `](${siteUrl}${markdownPath(target.url)}${hash})`;
  });
}

export const docsLlms = llms(source, {
  renderPage: async (page) => `# ${page.data.title}

> ${page.data.description ?? ""}

Source: ${siteUrl}${page.url}

${absoluteLinks(await page.data.getText("processed"), page.path, page.locale ?? i18n.defaultLanguage)}`,
  renderUrl: (item) => {
    const markdown = /^(\/.*)\.md$/.exec(item.url);
    return markdown
      ? `${siteUrl}${markdownPath(markdown[1])}`
      : `${siteUrl}${item.url}`;
  },
});
