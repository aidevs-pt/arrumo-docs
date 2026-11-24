import { Banner } from "fumadocs-ui/components/banner";
import { DocsLayout } from "fumadocs-ui/layouts/spacious";
import { RepoInfo } from "@/components/repo-info";
import { baseOptions } from "@/lib/layout.shared";
import { gitConfig } from "@/lib/shared";
import { source } from "@/lib/source";

const announcement = {
  en: { text: "Arrumo is now open source.", link: "Follow the roadmap" },
  es: {
    text: "Arrumo ya es de código abierto.",
    link: "Sigue la hoja de ruta",
  },
  pt: { text: "O Arrumo já é de código aberto.", link: "Acompanha o roteiro" },
};

export default async function Layout({
  params,
  children,
}: LayoutProps<"/[lang]/tools/arrumo/docs">) {
  const { lang } = await params;
  const base = baseOptions(lang);
  const news =
    announcement[lang as keyof typeof announcement] ?? announcement.en;
  return (
    <>
      <Banner id="arrumo-open-source">
        {news.text}{" "}
        <a
          href="https://github.com/orgs/aidevs-pt/projects/1"
          className="ms-1 underline underline-offset-4"
        >
          {news.link}
        </a>
      </Banner>
      <DocsLayout
        tree={source.getPageTree(lang)}
        {...base}
        links={[
          ...(base.links ?? []),
          {
            type: "custom",
            on: "menu",
            children: (
              <RepoInfo owner={gitConfig.user} repo="arrumo-video-editor" />
            ),
          },
        ]}
        sidebar={{ defaultOpenLevel: 1 }}
      >
        {children}
      </DocsLayout>
    </>
  );
}
