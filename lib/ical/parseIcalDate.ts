export function parseIcalDate(date: string, type: "start" | "end") {
	if (!date) return null;

	const clean = date.trim();

	if (/^\d{8}$/.test(clean)) {
		const year = Number(clean.slice(0, 4));
		const month = Number(clean.slice(4, 6)) - 1;
		const day = Number(clean.slice(6, 8));

		const d = new Date(year, month, day);

		if (type === "start") {
			d.setHours(16, 0, 0, 0);
		} else {
			d.setHours(10, 0, 0, 0);
		}

		return d;
	}

	const d = new Date(clean);

	if (type === "start") {
		d.setHours(16, 0, 0, 0);
	} else {
		d.setHours(10, 0, 0, 0);
	}

	return d;
}
