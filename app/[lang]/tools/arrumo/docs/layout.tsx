import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { CookieSettingsButton } from "@/components/consent";
import { baseOptions } from "@/lib/layout.shared";
import { source } from "@/lib/source";

export default async function Layout({
  params,
  children,
}: LayoutProps<"/[lang]/tools/arrumo/docs">) {
  const { lang } = await params;
  return (
    <DocsLayout
      tree={source.getPageTree(lang)}
      {...baseOptions(lang)}
      sidebar={{ footer: <CookieSettingsButton /> }}
    >
      {children}
    </DocsLayout>
  );
}
