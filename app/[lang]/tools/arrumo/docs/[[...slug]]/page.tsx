import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  MarkdownCopyButton,
  ViewOptionsPopover,
} from "fumadocs-ui/layouts/docs/page";
import { createRelativeLink } from "fumadocs-ui/mdx";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
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
          components={getMDXComponents({ a: createRelativeLink(source, page) })}
        />
      </DocsBody>
    </DocsPage>
  );
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
