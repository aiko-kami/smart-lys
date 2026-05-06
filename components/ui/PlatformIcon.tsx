"use client";

import type { Platform } from "@/types";
import { PLATFORMS } from "@/utils/constants";

export default function PlatformIcon({ platform }: { platform: Platform }) {
	const current = PLATFORMS.find((p) => p.value === platform);

	if (!current) {
		return <span className="text-gray-400">Inconnu</span>;
	}

	return (
		<div className="flex items-center gap-2">
			{"icon" in current && current.icon ? <current.icon className="text-xl" style={"color" in current ? { color: current.color } : undefined} title={current.label} /> : null}

			<span className="text-base text-gray-200">{current.label}</span>
		</div>
	);
}
