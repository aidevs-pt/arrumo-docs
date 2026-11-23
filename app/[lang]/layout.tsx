import { i18nProvider } from "fumadocs-ui/i18n";
import { Inter } from "next/font/google";
import Script from "next/script";
import { ConsentBanner } from "@/components/consent";
import { Provider } from "@/components/provider";
import { consentDefaultsScript, openaiPixelScript } from "@/lib/consent";
import { i18n } from "@/lib/i18n";
import { translations } from "@/lib/layout.shared";
import { siteUrl } from "@/lib/shared";
import "../global.css";

const inter = Inter({ subsets: ["latin"] });
const ahrefsKey = process.env.NEXT_PUBLIC_AHREFS_KEY;
const openaiPixelId = process.env.NEXT_PUBLIC_OPENAI_PIXEL_ID;

export const metadata = { metadataBase: new URL(siteUrl) };

export function generateStaticParams() {
  return i18n.languages.map((lang) => ({ lang }));
}

export default async function Layout({
  params,
  children,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  return (
    <html lang={lang} className={inter.className} suppressHydrationWarning>
      <head>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: fixed consent defaults */}
        <script dangerouslySetInnerHTML={{ __html: consentDefaultsScript }} />
        {openaiPixelId && (
          <script
            // biome-ignore lint/security/noDangerouslySetInnerHtml: fixed pixel loader
            dangerouslySetInnerHTML={{
              __html: openaiPixelScript(openaiPixelId),
            }}
          />
        )}
      </head>
      <body className="flex flex-col min-h-screen">
        {ahrefsKey && (
          <Script
            src="https://analytics.ahrefs.com/analytics.js"
            data-key={ahrefsKey}
            data-cfasync="false"
            strategy="afterInteractive"
          />
        )}
        <Provider i18n={i18nProvider(translations, lang)}>
          {children}
          <ConsentBanner />
        </Provider>
      </body>
    </html>
  );
}
