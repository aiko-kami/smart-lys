"use client";

import { FaLongArrowAltUp, FaLongArrowAltDown } from "react-icons/fa";
import type { SortDir } from "@/hooks/useSort";

export function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
	return <span className={`text-[14px] font-bold transition ${active ? "text-emerald-500" : "opacity-20"}`}>{active && dir === "desc" ? <FaLongArrowAltDown /> : <FaLongArrowAltUp />}</span>;
}

export function Th<K extends string>({
	label,
	sortKey,
	current,
	dir,
	onSort,
	align = "center",
}: {
	label: string;
	sortKey: K;
	current: K;
	dir: SortDir;
	onSort: (k: K) => void;
	align?: "left" | "center" | "right";
}) {
	const active = current === sortKey;
	return (
		<th
			onClick={() => onSort(sortKey)}
			className="cursor-pointer select-none whitespace-nowrap px-2 py-3 text-[10px] font-medium uppercase tracking-widest text-gray-500 hover:text-gray-400 transition"
		>
			<div className={`flex items-center gap-1 ${align === "center" ? "justify-center" : align === "right" ? "justify-end" : "justify-start"}`}>
				{label}
				<SortIcon active={active} dir={dir} />
			</div>
		</th>
	);
}
