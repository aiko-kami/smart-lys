import { useState, useMemo } from "react";

export type SortDir = "asc" | "desc";

export function useSort<T, K extends keyof T>(list: T[], defaultKey: K, defaultDir: SortDir = "asc") {
	const [sortKey, setSortKey] = useState<K>(defaultKey);
	const [sortDir, setSortDir] = useState<SortDir>(defaultDir);

	function handleSort(key: K) {
		if (key === sortKey) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
		else {
			setSortKey(key);
			setSortDir("asc");
		}
	}

	const sorted = useMemo(() => {
		return [...list].sort((a, b) => {
			let av: any = a[sortKey];
			let bv: any = b[sortKey];

			// dates
			if (av instanceof Date || (typeof av === "string" && !isNaN(Date.parse(av)))) {
				av = new Date(av).getTime();
				bv = new Date(bv).getTime();
			}

			if (av == null) return 1;
			if (bv == null) return -1;
			if (av < bv) return sortDir === "asc" ? -1 : 1;
			if (av > bv) return sortDir === "asc" ? 1 : -1;
			return 0;
		});
	}, [list, sortKey, sortDir]);

	return { sorted, sortKey, sortDir, handleSort };
}
