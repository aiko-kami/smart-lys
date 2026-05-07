import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	serverExternalPackages: ["mongoose", "ical.js", "@sparticuz/chromium"],

	webpack: (config) => {
		config.externals.push("@sparticuz/chromium");
		return config;
	},
};

export default nextConfig;
