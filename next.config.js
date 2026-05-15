const { execSync } = require("child_process");

function getBasePath() {
  if (process.env.NEXT_PUBLIC_BASE_PATH) return process.env.NEXT_PUBLIC_BASE_PATH;
  try {
    const remoteUrl = execSync("git remote get-url origin", { encoding: "utf8" }).trim();
    if (remoteUrl.includes("wendo-dev")) return "/wendo-dev";
    if (remoteUrl.includes("/wendo")) return "/wendo";
  } catch {}
  return "/wendo";
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