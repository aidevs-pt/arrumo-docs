// Puts each page's Markdown beside the page, so `…/docs/user/brand.md` answers with the Markdown of
// `…/docs/user/brand`, and a language's docs home has `…/docs/index.md`. Each section's
// `llms-full.txt` goes beside its pages too. The export renders the
// Markdown under the static path (`/tools/arrumo/static/md/…`) because a page and a route can't
// share a folder; aidevs.pt proxies `/tools/arrumo/docs/*` to `/en/tools/arrumo/docs/*` here.
// Vercel deploys from `.next` and skips files added to `out`, so there `vercel.json` rewrites
// the same addresses instead; this script serves any other static host.
import { cpSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const rendered = "out/tools/arrumo/static/md";
const languages = ["en", "es", "pt"];

function files(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? files(path) : [path];
  });
}

if (!existsSync(rendered)) {
  console.error(`No Markdown in ${rendered}; run next build first.`);
  process.exit(1);
}

let copied = 0;
for (const file of files(rendered).filter((path) => /\.(md|txt)$/.test(path))) {
  // `tools/arrumo/docs/user/brand.md` (English) or `pt/tools/arrumo/docs/user/brand.md`.
  const path = relative(rendered, file);
  const first = path.split("/", 1)[0];
  const lang = languages.includes(first) ? first : "en";
  const within = lang === first ? path.slice(first.length + 1) : path;
  const target = join(
    "out",
    lang,
    within.replace(/^tools\/arrumo\/docs\.md$/, "tools/arrumo/docs/index.md"),
  );
  cpSync(file, target);
  copied += 1;
}
console.log(`Placed ${copied} Markdown files beside their pages.`);
