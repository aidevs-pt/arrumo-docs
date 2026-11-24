import { DocsLayout } from "fumadocs-ui/layouts/spacious";
import { RepoInfo } from "@/components/repo-info";
import { baseOptions } from "@/lib/layout.shared";
import { gitConfig } from "@/lib/shared";
import { source } from "@/lib/source";

export default async function Layout({
  params,
  children,
}: LayoutProps<"/[lang]/tools/arrumo/docs">) {
  const { lang } = await params;
  const base = baseOptions(lang);
  return (
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
  );
}
