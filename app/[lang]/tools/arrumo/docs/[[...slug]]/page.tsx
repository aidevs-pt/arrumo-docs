import { posix } from "node:path";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  MarkdownCopyButton,
  ViewOptionsPopover,
} from "fumadocs-ui/layouts/docs/page";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ComponentProps } from "react";
import { getMDXComponents } from "@/components/mdx";
import { i18n } from "@/lib/i18n";
import { gitConfig, siteUrl, staticRoute } from "@/lib/shared";
import { source } from "@/lib/source";

export default async function Page(
  props: PageProps<"/[lang]/tools/arrumo/docs/[[...slug]]">,
) {
  const { slug, lang } = await props.params;
  const page = source.getPage(slug, lang);
  if (!page) notFound();

  const MDX = page.data.body;
  const markdownUrl = `${staticRoute}/md${page.url}.md`;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription className="mb-0">
        {page.data.description}
      </DocsDescription>
      <div className="flex flex-row gap-2 items-center border-b pb-6">
        <MarkdownCopyButton markdownUrl={markdownUrl} />
        <ViewOptionsPopover
          markdownUrl={markdownUrl}
          githubUrl={`https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/content/docs/${encodeURI(page.path)}`}
        />
      </div>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            a: ({ href, ...props }: ComponentProps<"a">) => (
              <defaultMdxComponents.a
                href={pageLink(href, page.path, lang)}
                {...props}
              />
            ),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

/** Content links to other pages by relative file path (`../plugins/index.md`); this turns them
 * into the page's URL in the same language. */
function pageLink(href: string | undefined, from: string, lang: string) {
  if (!href || /^([a-z]+:|#|\/)/i.test(href)) return href;
  const [file, hash] = href.split("#", 2);
  if (!/\.mdx?$/.test(file)) return href;
  // Page paths include the language folder (`pt/user/brand.md`).
  const within = from.startsWith(`${lang}/`)
    ? from.slice(lang.length + 1)
    : from;
  const path = posix.normalize(posix.join(posix.dirname(within), file));
  const slugs = path
    .replace(/\.mdx?$/, "")
    .split("/")
    .filter((part) => part && part !== "index");
  const target = source.getPage(slugs, lang);
  if (!target) return href;
  return hash ? `${target.url}#${hash}` : target.url;
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(
  props: PageProps<"/[lang]/tools/arrumo/docs/[[...slug]]">,
): Promise<Metadata> {
  const { slug, lang } = await props.params;
  const page = source.getPage(slug, lang);
  if (!page) notFound();
  return {
    title: `${page.data.title} | Arrumo AI Video Editor`,
    description: page.data.description,
    alternates: {
      canonical: `${siteUrl}${page.url}`,
      languages: Object.fromEntries([
        ...i18n.languages.flatMap((other) => {
          const translated = source.getPage(slug, other);
          return translated ? [[other, `${siteUrl}${translated.url}/`]] : [];
        }),
        [
          "x-default",
          `${siteUrl}${source.getPage(slug, "en")?.url ?? page.url}`,
        ],
      ]),
      types: { "text/markdown": `${siteUrl}${staticRoute}/md${page.url}.md` },
    },
  };
}
