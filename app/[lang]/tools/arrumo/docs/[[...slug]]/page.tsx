import { Card } from "fumadocs-ui/components/card";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  EditOnGitHub,
  MarkdownCopyButton,
  ViewOptionsPopover,
} from "fumadocs-ui/layouts/spacious/page";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  Children,
  type ComponentProps,
  isValidElement,
  type ReactNode,
} from "react";
import { CookieSettingsButton } from "@/components/consent";
import { getMDXComponents } from "@/components/mdx";
import { i18n } from "@/lib/i18n";
import { gitConfig, markdownPath, siteUrl } from "@/lib/shared";
import { linkedPage, source } from "@/lib/source";

export default async function Page(
  props: PageProps<"/[lang]/tools/arrumo/docs/[[...slug]]">,
) {
  const { slug, lang } = await props.params;
  const page = source.getPage(slug, lang);
  if (!page) notFound();

  const MDX = page.data.body;
  const markdownUrl = markdownPath(page.url);
  const githubUrl = `https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/content/docs/${encodeURI(page.path)}`;

  return (
    <DocsPage
      toc={page.data.toc}
      full={page.data.full}
      tableOfContent={{ style: "clerk" }}
      breadcrumb={{ includeRoot: true }}
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription className="mb-0">
        {page.data.description}
      </DocsDescription>
      <div className="flex flex-row flex-wrap gap-2 items-center border-b pb-6">
        <MarkdownCopyButton markdownUrl={markdownUrl} />
        <ViewOptionsPopover markdownUrl={markdownUrl} githubUrl={githubUrl} />
      </div>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            a: ({ href, children, ...props }: ComponentProps<"a">) => (
              <defaultMdxComponents.a
                href={pageHref(href, page.path, lang)}
                {...props}
              >
                {plainImages(children)}
              </defaultMdxComponents.a>
            ),
            // biome-ignore lint/correctness/noComponentHookFactories: rendered once on the server; links resolve against this page
            Card: ({ href, ...props }: ComponentProps<typeof Card>) => (
              <Card href={pageHref(href, page.path, lang)} {...props} />
            ),
          })}
        />
      </DocsBody>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t pt-4 text-sm">
        <EditOnGitHub href={githubUrl} />
        <CookieSettingsButton />
      </div>
    </DocsPage>
  );
}

/** Content links to other pages by relative file path; this gives the page's address. */
function pageHref(href: string | undefined, from: string, lang: string) {
  const target = href ? linkedPage(href, from, lang) : undefined;
  if (!target) return href;
  return href?.includes("#")
    ? `${target.url}#${href.split("#")[1]}`
    : target.url;
}

/** An image inside a link (a video thumbnail that opens YouTube) stays a plain image, so a click
 * follows the link instead of zooming. */
function plainImages(children: ReactNode) {
  return Children.map(children, (child) => {
    if (!isValidElement<ComponentProps<"img">>(child)) return child;
    if (typeof child.props.src !== "string") return child;
    // biome-ignore lint/performance/noImgElement: static export has no image optimizer
    return <img {...child.props} alt={child.props.alt ?? ""} />;
  });
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
      types: { "text/markdown": `${siteUrl}${markdownPath(page.url)}` },
    },
  };
}
