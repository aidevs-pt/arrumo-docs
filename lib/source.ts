import { llms, loader } from "fumadocs-core/source";
import { metaSchema, pageSchema } from "fumadocs-core/source/schema";
import { defineDocs } from "fumadocs-mdx/macro";
import { i18n } from "./i18n";
import { docsRoute, siteUrl, staticRoute } from "./shared";

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
});

export const docsLlms = llms(source, {
  renderPage: async (page) => `# ${page.data.title} (${siteUrl}${page.url})

${await page.data.getText("processed")}`,
  renderUrl: (item) =>
    /^\/.*\.(md|txt)$/.test(item.url)
      ? `${siteUrl}${staticRoute}/md${item.url}`
      : `${siteUrl}${item.url}`,
});
