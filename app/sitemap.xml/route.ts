import { i18n } from "@/lib/i18n";
import { siteUrl } from "@/lib/shared";
import { source } from "@/lib/source";

export const revalidate = false;

const xmlText = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

/** Every docs page in each language, with its translations as alternates. aidevs.pt serves it
 * as `/sitemap-arrumo-docs.xml` from its sitemap index. */
export function GET() {
  const entries = source.getPages(i18n.defaultLanguage).flatMap((english) => {
    const versions = i18n.languages.flatMap((lang) => {
      const page = source.getPage(english.slugs, lang);
      return page ? [{ lang, url: `${siteUrl}${page.url}` }] : [];
    });
    const alternates = [
      ...versions.map(
        ({ lang, url }) =>
          `<xhtml:link rel="alternate" hreflang="${lang}" href="${xmlText(url)}"/>`,
      ),
      `<xhtml:link rel="alternate" hreflang="x-default" href="${xmlText(versions[0].url)}"/>`,
    ].join("");
    return versions.map(
      ({ url }) =>
        `<url><loc>${xmlText(url)}</loc><changefreq>weekly</changefreq>${alternates}</url>`,
    );
  });
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join("\n")}
</urlset>
`;
  return new Response(xml, { headers: { "Content-Type": "application/xml" } });
}
