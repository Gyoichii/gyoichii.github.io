import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import type { NextConfig } from "next";

const resumeVersion = createHash("sha256").update(readFileSync("public/resume.pdf")).digest("hex").slice(0, 12);

const nextConfig: NextConfig = {
  output: "export",
  env: { NEXT_PUBLIC_RESUME_URL: `/resume.pdf?v=${resumeVersion}` },
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
};

export default nextConfig;
