import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/**
 * Exported to the paths aidevs.pt serves: `<lang>/tools/arrumo/docs/…` for pages (aidevs.pt drops
 * the `en` prefix) and `/tools/arrumo/static/…` for everything else.
 * @type {import('next').NextConfig}
 */
const config = {
  output: "export",
  reactStrictMode: true,
  trailingSlash: false,
  assetPrefix: "/tools/arrumo/static",
  images: { unoptimized: true },
};

export default withMDX(config);
