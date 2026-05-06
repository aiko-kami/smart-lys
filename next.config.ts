import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	serverExternalPackages: ["mongoose", "ical.js", "@sparticuz/chromium"],
};

export default nextConfig;
