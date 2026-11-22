// Every page and folder must exist in English, Spanish and Portuguese.
import { readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = "content/docs";
const languages = ["en", "es", "pt"];

function files(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? files(path) : [path];
  });
}

const sets = languages.map(
  (lang) =>
    new Set(
      files(join(root, lang)).map((path) => relative(join(root, lang), path)),
    ),
);
const all = new Set(sets.flatMap((set) => [...set]));
const missing = [];
for (const path of all) {
  languages.forEach((lang, index) => {
    if (!sets[index].has(path)) missing.push(`${lang}/${path}`);
  });
}
if (missing.length) {
  console.error(
    `Missing translations:\n${missing.map((path) => `  ${path}`).join("\n")}`,
  );
  process.exit(1);
}
console.log(`${all.size} files in each of ${languages.join(", ")}.`);
