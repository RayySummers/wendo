function getBasePath() {
  return "";
}

const basePath = getBasePath();

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  basePath,
  assetPrefix: basePath,
};

module.exports = nextConfig;