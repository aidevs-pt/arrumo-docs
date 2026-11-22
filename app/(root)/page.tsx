import type { Metadata } from "next";
import { basePath } from "@/lib/shared";

export const metadata: Metadata = { title: "Arrumo documentation" };

const languages = [
  { lang: "en", name: "English" },
  { lang: "es", name: "Español" },
  { lang: "pt", name: "Português" },
];

/** Static export has no server redirect, so the browser picks the reader's language. */
const pick = `(function(){var l=(navigator.languages||[navigator.language]).map(function(x){return String(x).slice(0,2)});var s=l.find(function(x){return ['en','es','pt'].indexOf(x)>=0})||'en';location.replace(${JSON.stringify(basePath)}+'/'+s+'/');})();`;

export default function Root() {
  return (
    <main className="m-auto flex flex-col items-center gap-4 p-8 text-center">
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: fixed inline redirect script */}
      <script dangerouslySetInnerHTML={{ __html: pick }} />
      <h1 className="text-2xl font-semibold">Arrumo</h1>
      <ul className="flex gap-4">
        {languages.map(({ lang, name }) => (
          <li key={lang}>
            <a className="underline" href={`${basePath}/${lang}/`}>
              {name}
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
