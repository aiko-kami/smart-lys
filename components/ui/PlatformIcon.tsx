"use client";

import type { Platform } from "@/types";
import { PLATFORMS } from "@/utils/constants";

export function PlatformIcon({ platform, logoOnly = false }: { platform: Platform; logoOnly?: boolean }) {
	const current = PLATFORMS.find((p) => p.value === platform);

	if (!current) {
		return <span className="text-gray-400">Inconnu</span>;
	}

	return (
		<div className="flex items-center gap-1.5 justify-center">
			{"icon" in current && current.icon ? (
				<current.icon className={`text-xl ${current.value === "booking" ? "bg-white" : ""}`} style={"color" in current ? { color: current.color } : undefined} title={current.label} />
			) : null}
			{!logoOnly && <span className="text-sm text-gray-200">{current.label}</span>}
		</div>
	);
}

export function PlatformIconButton({ platform, logoOnly = false, action, disabled, active }: { platform: Platform; logoOnly?: boolean; action?: () => void; disabled?: boolean; active?: boolean }) {
	const current = PLATFORMS.find((p) => p.value === platform);

	if (!current) {
		return <span className="text-gray-400">Inconnu</span>;
	}

	return (
		<button
			type="button"
			onClick={action}
			disabled={disabled}
			style={active ? { borderColor: `${current.borderColor}`, background: `${current.bg}` } : {}}
			className="flex items-center gap-1.5 py-2 justify-center rounded-xl border border-white/10 px-2 text-sm text-gray-200 hover:bg-white/5 transition"
		>
			{"icon" in current && current.icon ? (
				<current.icon className={`text-xl ${current.value === "booking" ? "bg-white" : ""}`} style={"color" in current ? { color: current.color } : undefined} title={current.label} />
			) : null}
			{!logoOnly && <span className="text-sm text-gray-200">{current.label}</span>}
		</button>
	);
}
